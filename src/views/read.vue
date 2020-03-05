<template>
<section class="read">
	<read-content :read-content="readContent" @show-menu="showMenu" @next-chapter="nextChapter">
	</read-content>
	<chapter :chapters="chapters" :show="isShowChapters" @hide-menu="hideMenu" @select-chapter='selectChapter' v-if="chapters.length > 0">
	</chapter>
	<list-loading v-show="isLoading"></list-loading>
	<page-loading :option='pageOption' v-if="isShowPageLoading"></page-loading>
	<!-- <v-dialog v-show="showDialog" :dialog-option="dialogOption" ref="dialog"></v-dialog> -->
</section>
</template>

<script>
import {
	mapState,
	mapMutations
} from 'vuex';
import api from '../fetch/api';
import chapter from '@/components/Chapter';
import readContent from '@/components/ReadContent';
import listLoading from '@/components/ListLoading';
import pageLoading from '@/components/PageLoading';
// import dialog from '@/components/Dialog';
import {
	debounce
} from '../util/util';

export default {
	name: 'read',
	components: {
		chapter,
		readContent,
		listLoading,
		pageLoading,
		// 'v-dialog': dialog
	},
	data() {
		return {
			isShowPageLoading: true,
			showDialog: false,//关闭一个评论组件
			bookId: '',
			chapters: [],//章节数据，用来传给子组件，fetchChapters在这个方法里面获得数据，再传过去，这个方法在created生命周期里面调用
			isShowChapters: false,
			isFromMenu: false,//false回到内容页面，true回到详情页面，详情页是book路由，章节和内容页都是read路由
			readContent: [],//章节内容
			isLoading: true,
			isEnding: false,
			readIndex: 0,//当前阅读的章节编号（-1）
			pageOption: {
				top: '0px',
				bottom: '0px'
			},
			dialogOption: {
				title: '加入书架',
				text: '喜欢本书就加入书架吧',
				cancelButtonText: '不用了',
				confirmButtonText: '加入书架'
			}
		}
	},
	computed: {
		...mapState([
			'curBook',
			'shelfBookList'
		])
	},
	watch: {
		chapters: function() {//它更新就重新调用请求章节内容的方法
			if (this.curBook.readChapter !== '') {
				// 去书架中取书籍的历史阅读记录
				console.log("我是this.chapters",this.chapters)
				console.log("我是Object.entries(this.chapters)",Object.entries(this.chapters))
				for (let [idx, chapter] of Object.entries(this.chapters)) {
					if (this.curBook.readChapter === chapter.id) {
						this.readIndex = idx;
						console.log("我是this.readIndex",this.readIndex)
						break;
					}
				}
			}
			this.fetchChapterContent(this.chapters[this.readIndex].id);
		},
		readIndex: function() {//它更新就去更新VUEX的数据
			let book = this.curBook;
			book.readChapter = this.chapters[this.readIndex].id;
			this.SET_CUR_BOOK(book);
		}
	},
	created() {//在渲染完成以前就把所有的数据处理掉
		this.bookId = this.$route.params.id;//路由跳转时传过来的
		for (let book of Object.values(this.shelfBookList)) {//只有书架中有书才会执行
			if (this.bookId === book.id) {//跟书架中书配对后就更新VUEX数据
				this.SET_CUR_BOOK(book);//有本地缓存的
				break;
			}
		}
		this.fetchChapters(this.bookId);//拿到章节目录
		if(this.$route.query.menu) {//只有传了个MENU过来，才就去到详情页和把章节目录展示出来
			this.isFromMenu = true;
			this.isShowChapters = true;
		}
	},
	methods: {
		...mapMutations([
			'SET_CUR_BOOK',
			'ADD_TO_SHELF'
		]),
		fetchChapters(bookId) {
			api.getChapters(bookId)
				.then(data => {
					console.log("我是getchapters",data)
					this.chapters = data;
				})
		},
		fetchChapterContent(chapterId) {
			api.getChapterContent(chapterId)
				.then(data => { 
					console.log("我是getchaptercontent",data)
					this.readContent.push({
						contentTitle: data.title,
						contentList: data.isVip ? ['vip章节，请到正版网站阅读'] : data.cpContent.split('\n')
					});
					this.isLoading = false;
					this.$nextTick(function() {
						this.isShowPageLoading = false;
					})
				})
		},
		showMenu: function() {
			this.isShowChapters = true;//把章节给展示出来
		},
		hideMenu: function() {
			console.log("我是this.isFormMenu",this.isFromMenu);
			if(this.isFromMenu) {//如果详情页存在，就返回一次路由
				this.$router.go(-1);
			}
			this.isShowChapters = false;//关闭章节组件
		},
		nextChapter: function() {
			if (this.readIndex === this.chapters.length - 1) {//没有章节就滚
				return;
			}
			this.readIndex++;//把阅读章节的序号+1
			this.isLoading = true;//
			this.fetchChapterContent(this.chapters[this.readIndex].id);//去请求下一章的内容。
		},
		selectChapter: function(chapterId) {
			if(this.isFromMenu) {
				this.isFromMenu = false;//关闭详情页面
			}
			this.isShowChapters = false;//关闭章节组件
			this.isShowPageLoading = true;//显示等待动画
			for (let [index, value] of Object.entries(this.chapters)) {
				if (value.id === chapterId) {//找到传进来的章节ID
					this.readIndex = index;//记录章节的序号
					break;
				}
			}
			api.getChapterContent(chapterId)//开始请求章节内容的数据
				.then(data => {
					this.readContent.splice(0, this.readContent.length);//清空本来的readcontent
					this.readContent.push({//Push新的章节内容
						contentTitle: data.title,
						contentList: data.isVip ? ['vip章节，请到正版网站阅读'] : data.cpContent.split('\n')
					});
					this.$nextTick(function() {
						this.isShowPageLoading = false;//等数据更新完成时，把loading动画关掉
					})
				})
		}
	},
	/*
	beforeRouteLeave(to, from, next) {//路由离开之前
		if (!this.curBook.isInShelf && !this.isFromMenu) {//不在书架和在内容页面同时满足就执行下面的代码
			this.showDialog = true;//打开弹窗
			this.$refs.dialog.confirm().then(() => {//在这里调用组件里面的confirm方法，成功后执行下面的方法
				this.showDialog = false;//关闭弹窗
                let book = this.curBook;
    			book.isInShelf = true;//把加入书架的标志记录为true
    			this.SET_CUR_BOOK(book);//更新VUEX的数据
    			this.ADD_TO_SHELF(book);//更新VUEX的数据
				next();//格式要求
			}).catch(() => {
				this.showDialog = false;//失败函数就关闭弹窗
				next();
			})
		} else {
			next()
		}
	}
	*/
}
</script>

<style lang="scss">
.read {
    position: relative;
    height: 100%;
}
</style>
