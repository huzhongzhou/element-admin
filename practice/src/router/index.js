import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);


const routes = [
  {
    path: '*',
    redirect: '/home/index'
  },
  {
    path: '/home/index',
    component: () => import('@/view/home/index.vue'),
    meta: {
      title: '首页',
    }
  },
  {
    path: '/product/index',
    component: () => import('@/view/product/index.vue'),
    meta: {
      title: '产品',
    }
  },

]
// //push
// const VueRouterPush = Router.prototype.push
// Router.prototype.push = function push (to) {
//   return VueRouterPush.call(this, to).catch(err => err)
// }
// //replace
// const VueRouterReplace = Router.prototype.replace
// Router.prototype.replace = function replace (to) {
//   return VueRouterReplace.call(this, to).catch(err => err)
// }

const router = new Router({ 
  mode:'hash',
  routes,
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
        return {x:savedPosition.x ,y:to.meta.savedPosition}
    } else {
        return { x: 0, y: 0 }
    }
  }
});

router.onError((err)=>{
  // Toast.fail('加载失败,请检查网络后重试')
  console.log('router err',err)
})

router.beforeEach((to, from, next) => {
  const title = to.meta && to.meta.title;
  // if (to.meta.login) {
  //   next()
  // } else {
  //   if(!window.iGlobal.getToken() && !window.iGlobal.GetQueryString('ZYToken')){
  //     location.href = window.iGlobal.getRedirectUrl()
  //     return
  //   }
  //   // else if (!window.iGlobal.getToken()){
  //   //   console.log('进3')
  //   //   const token = await window.iGlobal.loginByToken()
  //   //   console.log('here',token)
  //   //   window.iGlobal.setToken(token)
  //   // }
  //   next()
  // }
  if (title) {
    document.title = title;
  }
  next();
});

export default router
