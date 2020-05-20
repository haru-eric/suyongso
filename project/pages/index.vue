<template>
    <div>
        <div class='articles desktop-only'>
            <div class='articleBox'>
                <HitArticle :topics='topics'/>
            </div>
            <div class='articleBox'>
                <Article subject='애니동' domain='anime' :topics='topics'/>
                <Article subject='게임동' domain='game' :topics='topics'/>
            </div>
            <div class='articleBox'>
                <Article subject='리뷰동' domain='review' :topics='topics'/>
                <Article subject='뉴스동' domain='news' :topics='topics'/>
            </div>
            <div class='articleBox'>
                <PhotoArticle subject='만화동' domain='manga' :topics='topics'/>
                <PhotoArticle subject='그림동' domain='draw' :topics='topics'/>
            </div>
        </div>
        <div class='articles mobile-only'>
            <div class='articleBox'>
                <Article subject='애니동' domain='anime' :topics='topics'/>
            </div>
            <div class='articleBox'>
                <Article subject='게임동' domain='game' :topics='topics'/>
            </div>
        </div>
    </div>
</template>

<script>
    import Article from '~/components/article'
    import HitArticle from '~/components/article/hit.vue'
    import PhotoArticle from '~/components/article/photo.vue'

    export default {
        components: {
			Article,
            HitArticle,
            PhotoArticle
        },
        data() {
            return {
                domain: 'anime',
                topics: [],
                topicsCount: 0,
                page: 0,
                bottom: false,
                lading: false
            }
        },
        watch: {
            '$store.state.forceUpdate': function() {
                this.getData('all', true)
            }
        },
        mounted() {
            // if (process.browser) {
            //     window.addEventListener('scroll', () => {
            //     this.bottom = this.bottomVisible()
            //     })
            // }
            this.getData()
        },
        methods: {
            getData: async function(domain = this.domain, forceUpdate = false) {
                this.$store.commit('setLoading', true)
                if (this.domain != domain)
                    this.domain = domain
                if (forceUpdate) {
                    this.topics = []
                    this.topicsCount = 0
                    this.page = 0
                }
                const data = await this.$axios.$post(
                    '/api/topic/list',
                    { domain, page: this.page++, limit: 5 }
                )
                if (!data.topics)
                    return this.$store.commit('setLoading')
                data.topics.map(topic => this.topics.push(topic))
                console.log(this.topics)
                this.topicsCount = data.count
                this.$store.commit('setLoading')
                return data
            },
        }
    }
</script>

<style lang='less' scoped>
    .articles {
        padding: 5px;
        &.mobile-only {
            padding: 0;
        }
    }

    // article
    .articleBox {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
    }
    .articleBox:last-child {
        margin: 0;
    }
</style>