/* eslint-disable @typescript-eslint/no-unused-vars */
export namespace Code {
  type CodeInfo = {
    code: string;
    type:
      | 'static'
      | 'angular'
      | 'react'
      | 'react-ts'
      | 'solid'
      | 'svelte'
      | 'test-ts'
      | 'vanilla-ts'
      | 'vanilla'
      | 'vue'
      | 'vue-ts'
      | 'node'
      | 'nextjs'
      | 'vite'
      | 'vite-react'
      | 'vite-react-ts'
      | 'vite-preact'
      | 'vite-preact-ts'
      | 'vite-vue'
      | 'vite-vue-ts'
      | 'vite-svelte'
      | 'vite-svelte-ts'
      | 'astro';
    description: string;
  };

  type ListResult = {
    codeList: CodeInfo[];
    total: number;
  };
}
