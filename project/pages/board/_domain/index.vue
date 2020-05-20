<template>
    <article>
        <h1>
            <img src='/sub-icon.png'>
            <span>{{ getBoardName() }}</span>
        </h1>
        <BoardList :id='0' :purePage='$route.query.page || 1' :domain='domain'/>
    </article>
</template>

<script>
    import BoardList from '~/components/board/list.vue'
    import Library from '~/assets/lib.js'
    
    export default {
        components: {
            BoardList
        },
        async asyncData ({ params }) {
            const domain = params.domain
            return { domain }
        },
        data() {
            return {
                domain: ''
            }
        },
        methods: {
            getBoardName(domain = this.domain) {
                return Library.getBoardName(domain)
            }
        }
    }
</script>

<style lang='less' scoped>
    article {
        border: 1px solid #eee;
        > h1 {
            margin: -7px 0 5px 5px;
            > img {
                width: 36px;
                height: auto;
            }
            > span {
                margin-left: -5px;
                color: #2D99E1;
                font-size: 26px;
                font-weight: bold;
            }
        }
    }
</style>