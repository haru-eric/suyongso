<template>
    <!-- container -->
    <div class='containerBox'>
        <!-- modal -->
        <div>
            <Modal/>
        </div>
        <!-- notify -->
        <Notify v-if='$store.state.user.isLogged && $store.state.user.noticeCount > 0'/>
        <!-- header -->
        <header>
            <aside/>
            <section>
                <Header/>
            </section>
            <aside/>
        </header>
        <!-- main -->
        <main>
            <aside/>
            <section class='panel'>
                <!-- sidebar -->
                <article class='sidebar'>
                    <Sidebar/>
                </article>
                <!-- inner -->
                <article class='inner'>
                    <nuxt/>
                </article>
            </section>
            <aside/>
        </main>
        <!-- footer -->
        <footer>
            <aside/>
            <section>
                <Footer/>
            </section>
            <aside/>
        </footer>
        <!-- music player -->
        <Aplayer class='desktop-only'/>
    </div>
</template>

<script>
    import Modal from '~/components/modal.vue'
    import Notify from '~/components/header/notify.vue'
    import Header from '~/components/header'
    import Sidebar from '~/components/sidebar.vue'
    import Footer from '~/components/footer.vue'
    import Aplayer from '~/components/aplayer.vue'
    
    export default {
        components: {
            Modal,
            Notify,
            Header,
            Sidebar,
            Footer,
            Aplayer
        },
        data() {
            return {
                ver: {
                    backend: 0,
                    frontend: 309
                }
            }
        },
        beforeMount() {
            this.$socket.on('newBest', data => {
                this.$toast(`[HIT] ${data.title}`, {
                    timeout: 1000,
                    icon: false,
                    onClick: () => this.move(data)
                })
                this.playSound('https://suyongso.co/bb1.mp3')
            })
            this.$socket.on('newTopic', data => {
                this.$toast(data.title, {
                    timeout: 1000,
                    icon: false,
                    onClick: () => this.move(data)
                })
                this.playSound('https://suyongso.co/bb1.mp3')
            })
        },
        mounted() {
            this.checkVersion()
            this.checkLogged()
            this.getNotices()
            this.updateNotices()
        },
        beforeDestroy() {
            if (this.$socket) {
                this.$socket.removeAllListeners()
                this.$socket.clear()
            }
        },
        methods: {
            checkVersion: async function() {
                const data = await this.$axios.$get('/api/version')
                this.ver.backend = data.version || 0
            },
            checkLogged: async function() {
                const token = localStorage.token
                if (!token)
                    return
                const data = await this.$axios.$get(
                    '/api/auth/check',
                    { headers: { 'x-access-token': token } }
                )
                if (data.status === 'fail')
                    return
                data.token = token
                this.$store.commit('user/setUser', data)
            },
            getNotices: async function() {
                const token = localStorage.token
                if (!token)
                    return
                const data = await this.$axios.$get(
                    '/api/notice',
                    { headers: { 'x-access-token': token } }
                )
                if (data.count)
                    this.$store.commit('user/setNoticeCount', data.count)
            },
            updateNotices() {
                setTimeout(async () => {
                    this.getNotices()
                    this.updateNotices()
                }, 10000)
            },
            move(item) {
                this.$router.push({ path: `/${item.id}` })
            },
            playSound(sound) {
                if (!sound)
                    return
                const audio = new Audio(sound)
                audio.play()
            }
        }
    }
</script>

<style lang='less' scope>
    body {
        background-color: #F9F9F9;
    }

    section {
        max-width: 1160px;
        margin: 0 auto;
    }

    header {
        margin-bottom: 0.5rem;
        background-color: #2D99E1;
    }

    main {
        flex: 1;
        > section.panel {
            display: flex;
            > article.sidebar {
                flex-basis: 210px;
                flex-shrink: 0;
                margin-right: 10px;
            }
            > article.inner {
                flex: 1;
                background-color: #fff;
            }
        }
    }

    footer {
        padding: 15px 0;
        color: rgb(247, 247, 247);
        background-color: rgb(91, 104, 130);
    }

    // container
    .containerBox {
        display: flex;
        min-height: 100vh;
        flex-direction: column;
    }
</style>