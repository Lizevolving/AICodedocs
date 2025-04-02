// 类型声明文件，用于告诉 TypeScript 如何处理 .vue 文件导入
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
} 
