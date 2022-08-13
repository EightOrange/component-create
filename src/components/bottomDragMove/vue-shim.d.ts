import {ref} from "vue";

declare module '*.vue' {
    const $refs: ref
    export default $refs;
}
