import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from 'path';
import components from "unplugin-vue-components/vite"
import {VarletUIResolver} from 'unplugin-vue-components/resolvers'


// https://vitejs.dev/config/
export default defineConfig({
    server: {
        proxy: {

        }
    },
    plugins: [
        vue(),
        components({
            resolvers: [VarletUIResolver()]
        })
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, "src"),

        }
    }
})
