const path = require('path')


module.exports = {
    devServer: {
       port:8080,
        proxy: {
            '/chapterapi': {
                target: 'http://chapter2.zhuishushenqi.com/chapter/http://vip.zhuishushenqi.com',
                changeOrigin: true,
                pathRewrite: {                
                  '^/chapterapi': ''
                }
              },
              '/api': {
                target: 'http://api.zhuishushenqi.com',
                changeOrigin: true,
                pathRewrite: {                
                  '^/api': ''
                }   
              }
        }
    },
    pluginOptions: {
      'style-resources-loader': {
        preProcessor: 'scss',
        patterns: [
            'E:\\newproject\\第一个项目\\xiaoshuo\\src\\scss\\*.scss',
        ]
      }
    }
}

   

   // '/chapterapi': {
    //    target: 'http://chapter2.zhuishushenqi.com/chapter/http://vip.zhuishushenqi.com',
    //    changeOrigin: true,
     //   pathRewrite: {                //需要rewrite重写的, 如果在服务器端做了处理则可以不要这段
     //     '^/chapterapi': ''
      //  }
    //  },
    //  '/api': {
     //   target: 'http://api.zhuishushenqi.com',
     //   changeOrigin: true,
    //    pathRewrite: {                //需要rewrite重写的, 如果在服务器端做了处理则可以不要这段
    //      '^/api': ''
    //    }   
//}



//
   
    
