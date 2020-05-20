<template>
    <div class='boardBox'>
        <b-modal
            id='bv-remove-modal'
            @ok='remove'
            title='알림'
            title-tag='h6'
            cancel-title='취소'
            ok-title='확인'
            size='sm'
            auto-focus-button='ok'
            centered>
            정말로 삭제하시겠습니까?
        </b-modal>
        <h1>
            <img src='/sub-icon.png'>
            <span>게시판</span>
        </h1>
        <b-form-group class='mt-3'>
            <nuxt-link :to='`/board/${topic.boardDomain}`'>
                <b-button size='sm' variant='outline-primary'>
                    <font-awesome-icon icon='file-alt'/>
                    목록
                </b-button>
            </nuxt-link>
            <!-- <b-button size='sm' variant='outline-primary'>
                <font-awesome-icon icon='arrow-up'/>
                인기글
            </b-button> -->
            <nuxt-link :to='`/board/${topic.boardDomain}/write`'>
                <b-button
                    class='float-right'
                    size='sm'
                    variant='outline-primary'
                    v-shortkey.once='["w"]'
					@shortkey='$router.push({ path: "/board/" + topic.boardDomain + "/write" })'>
                    <font-awesome-icon icon='pencil-alt'/>
                    쓰기
                </b-button>
            </nuxt-link>
        </b-form-group>
        <article>
            <h6>
                <div class='regdate'>
                    <span>{{ $moment(topic.created).fromNow() }}</span>
                </div>
                <div>{{ topic.title }}</div>
            </h6>
            <div class='profile'>
                <img :src='topic.profile ? "https://suyongso.co/profile/" + topic.profile : "/profile.png"' @error='imageUrlAlt'>
                <div class='author'>{{ topic.author }}</div>
                <div class='info'>
                    <div>
                        <span>조회수 <strong>{{ numberWithCommas(topic.hits) }}</strong></span>
                        <span>댓글 <strong>1</strong></span>
                        <span>예스잼 <strong>{{ numberWithCommas(topic.likes) }}</strong></span>
                        <span>노잼 <strong>{{ numberWithCommas(topic.hates) }}</strong></span>
                    </div>
                    <div>
                        <nuxt-link :to='`/${id}`'>https://suyongso.co/{{ id }}</nuxt-link>
                    </div>
                </div>
            </div>
            <div class='content'>
                <span v-html='topic.content' />
            </div>
            <div class='recommend'>
                <div class='likes' @click='votes()'>
                    <strong>{{ numberWithCommas(topic.likes) }}</strong>
                    <div>예스잼</div>
                </div>
                <div class='hates' @click='votes(false)'>
                    <strong>{{ numberWithCommas(topic.hates) }}</strong>
                    <div>노잼</div>
                </div>
            </div>
            <div class='file' v-if='images.length > 0'>
                <div v-for='(item, index) in images' :key='index'>
                    <div>첨부 {{ index + 1 }}</div>
                    <div>
                        <nuxt-link to=''>{{ item.name }}</nuxt-link>
                        <b-button size='sm' @click='downloadWithAxios(item.imageUrl, item.name)'>
                            <font-awesome-icon icon='download'/>
                        </b-button>
                    </div>
                </div>
            </div>
        </article>
        <b-form-group>
            <nuxt-link :to='`/board/${topic.boardDomain}`'>
                <b-button size='sm' variant='outline-primary'>
                    <font-awesome-icon icon='file-alt'/>
                    목록
                </b-button>
            </nuxt-link>
            <b-button size='sm' variant='outline-primary' @click='removeHandler' v-if='$store.state.user.isLogged'>
                <font-awesome-icon icon='trash'/>
                삭제
            </b-button>
            <b-button-group class='float-right'>
                <b-button size='sm'>
                    <font-awesome-icon icon='arrow-down'/>
                </b-button>
                <b-button size='sm'>
                    <font-awesome-icon icon='arrow-up'/>
                </b-button>
            </b-button-group>
        </b-form-group>
        <div class='comment'>
            <BoardCommentList :id='id' :topic='topic'/>
        </div>
        <BoardList :id='id' :purePage='$route.query.page || 1' :domain='topic.boardDomain'/>
    </div>
</template>

<script>
    import BoardList from '~/components/board/list.vue'
    import BoardCommentList from '~/components/board/comment/list.vue'

    export default {
        components: {
            BoardList,
            BoardCommentList
        },
        validate ({ params }) {
            return /^\d+$/.test(params.id)
        },
        data() {
            return {
                id: 0,
                topic: {
                    userId: 0,
                    boardDomain: '',
                    category: '',
                    author: '',
                    title: '',
                    content: '',
                    ip: '',
                    header: '',
                    created: '',
                    updated: '',
                    hits: 0,
                    likes: 0,
                    hates: 0,
                    isChart: false,
                    isImage: false,
                    isBest: false,
                    isNotice: false,
                    profile: '',
                    admin: 0
                },
                chart: {
                    data: [],
                    labels: [],
                    select: 0
                },
                images: [],
                loading: true
            }
        },
        async asyncData ({ app, params, store, $axios }) {
            const id = params.id
            const token = store.state.user.isLogged ? store.state.user.token : ''
            const data = await $axios.$get(
                `/api/topic/read/${id}`,
                { headers: { 'x-access-token': token } }
            )
            if (data.status === 'fail')
                return console.log(data.message)
            if (store.state.user.isLogged)
                store.commit('user/setNoticeCount', data.count)
            const charts = data.charts ? data.charts.map(item => item.text) : []
            const chartVotes = []
            if (data.chartVotes)
                data.chartVotes.map(item => chartVotes[item.select] = item.count)
            return {
                id,
                topic: data.topic,
                charts: {
                    data: chartVotes,
                    labels: charts,
                    select: 0
                },
                images: data.images
            }
        },
        beforeMount() {
            this.$socket.emit('join', this.id)
            this.$socket.on('vote', data => {
                this.topic.likes = data.likes
                this.topic.hates = data.hates
            })
        },
        beforeDestroy() {
            this.$socket.emit('leave', this.id)
            this.$socket.removeAllListeners()
        },
        methods: {
            votes: async function(flag = true) {
                if (this.id < 1)
                    return
                if (!this.$store.state.user.isLogged)
                    return this.toast('로그인하세요.', 'warning')
                const token = this.$store.state.user.token
                this.$store.commit('setLoading', true)
                const data = await this.$axios.$post(
                '/api/topic/vote',
                    { id: this.id, likes: flag },
                    { headers: { 'x-access-token': token } }
                )
                if (data.status === 'fail') {
                    this.$store.commit('setLoading')
                    return this.toast(data.message || '오류가 발생했습니다.', 'danger')
                }
                data.move === 'BEST' ? this.toast('HIT 게시판으로 이전되었습니다!', 'primary') : this.toast('투표했습니다.', 'success')
                this.$store.commit('setLoading')
            },
            chartVotes: async function() {
                if (this.charts.select < 0 || this.charts.select > this.charts.labels.length)
                    return
                if (!this.$store.state.user.isLogged)
                    return this.toast('로그인하세요.', 'warning')
                const token = this.$store.state.user.token
                this.$store.commit('setLoading', true)
                const data = await this.$axios.$post(
                    '/api/chart/vote',
                    { id: this.id, select: this.charts.select },
                    { headers: { 'x-access-token': token } }
                )
                if (data.status === 'fail') {
                    this.$store.commit('setLoading')
                    return this.toast(data.message || '오류가 발생했습니다.', 'danger')
                }
                this.toast('설문조사를 참여했습니다.', 'success')
                this.$store.commit('setLoading')
            },
            copyLink: async function(link) {
                this.toast('링크를 복사했습니다.', 'success')
                this.$copyText(link)
            },
            forceFileDownload(blob, name) {
                const url = window.URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.href = url
                link.setAttribute('download', name)
                document.body.appendChild(link)
                link.click()
            },
            async downloadWithAxios(url, name) {
                await fetch(
                    `https://suyongso.co/img/${url}`,
                    {
                        headers: { 'Accept': 'image/*', },
                        responseType: 'arraybuffer'
                    }
                )
                .then(response => {
                    if (response.ok)
                        return response.blob()
                })
                .then(blob => {
                    this.forceFileDownload(blob, name)
                })
            },
            removeHandler: async function() {
                if (this.id < 1 || !this.$store.state.user.isLogged)
                    return
                this.$bvModal.show('bv-remove-modal')
            },
            remove: async function() {
                const token = this.$store.state.user.token
                this.$store.commit('setLoading', true)
                const data = await this.$axios.$delete(
                    '/api/topic/delete',
                    {
                        data: { id: this.id },
                        headers: { 'x-access-token': token }
                    }
                )
                if (data.status === 'fail') {
                    this.$store.commit('setLoading')
                    return this.toast(data.message || '오류가 발생했습니다.', 'danger')
                }
                this.$router.go(-1)
            },
            scrollToBottom() {
                this.$nextTick(() => {
                    this.$refs.messages.scrollTop = this.$refs.messages.scrollHeight
                })
            },
            numberWithCommas(x) {
                return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            },
            imageUrlAlt(event) {
                event.target.src = 'https://github.com/u3u.png'
            },
            toast(text, variant = 'default') {
                this.$bvToast.toast(text, {
                    title: '알림',
                    toaster: 'b-toaster-top-center',
                    variant: variant,
                    solid: true,
                    appendToast: true
                })
            }
        },
        head () {
            return {
                title: `${this.topic.title} - 수용소`,
                meta: [
                    { hid: `${this.id}`, name: `${this.topic.content.substr(0, 100)}`, content: '수용소 - 서브컬쳐 커뮤니티' }
                ]
            }
        }
    }
</script>

<style lang='less' scoped>
    .boardBox {
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

    article {
        > h6 {
            color: rgb(51, 51, 51);
            font-size: 12px;
            margin: 0;
            > div {
                line-height: 18px;
                padding: 11px;
                font-weight: 700;
                white-space: nowrap;
                border: 1px solid rgb(204, 204, 204);
                border-left: 0;
                border-right: 0;
                background-color: rgb(252, 252, 252);
                &.regdate {
                    float: right;
                    > span {
                        font-weight: 400;
                        letter-spacing: normal;
                    }
                }
            }
        }
        > .profile {
            min-height: 85px;
            border-bottom: 1px solid rgb(238, 238, 238);
            > img {
                float: left;
                width: 76px;
                height: auto;
                min-width: 76px;
                min-height: 76px;
                max-width: 100%;
                padding: 3px;
                background-color: #fff;
                border: 1px solid rgb(221, 221, 221);
                margin: 4px 0 4px 6px;
            }
            > .author {
                display: inline-block;
                padding: 9px 16px;
                color: rgb(51, 51, 51);
                font-size: 11px;
                cursor: pointer;
            }
            > .info {
                display: inline-block;
                float: right;
                padding: 9px;
                text-align: right;
                > div {
                    > span {
                        padding: 0 6px;
                        color: rgb(136, 136, 136);
                        font-size: 11px;
                        letter-spacing: -1px;
                        > strong {
                            padding-left: 2px;
                            color: rgb(102, 102, 102);
                            letter-spacing: normal;
                        }
                        &:nth-child(3) > strong { color: rgb(45, 153, 225) }
                        &:nth-child(4) > strong { color: rgb(216, 55, 34) }
                    }
                    > a {
                        margin-top: -5px;
                        padding: 0 8px;
                        color: rgb(153, 153, 153);
                        font-size: 11px;
                        text-decoration: none;
                        cursor: pointer;
                    }
                }
            }
        }
        > .content {
            line-height: 1.5;
            padding: 20px;
            color: #000;
            font-size: 12px;
            overflow-wrap: break-word;
        }
        > .recommend {
            margin: 20px 0;
            text-align: center;
            > div {
                display: inline-block;
                width: 46px;
                height: 46px;
                border: 2px solid rgb(45, 153, 225);
                border-radius: 4px;
                margin: 0 8px;
                color: rgb(45, 153, 225);
                text-decoration: none;
                cursor: pointer;
                > strong {
                    padding-top: 7px;
                    font-size: 17px;
                    line-height: 1;
                }
                > div {
                    font-size: 11px;
                    font-weight: 700;
                }
            }
        }
        > .file {
            margin-bottom: 1rem;
            border: 1px solid rgb(128, 128, 128);
            border-left: 0;
            border-right: 0;
            vertical-align: middle;
            > div {
                margin-bottom: -20px;
                &:last-child { margin: 0 }
                > div {
                    display: inline-block;
                    padding: 10px 12px;
                    font-size: 12px;
                    font-weight: 700;
                    text-align: center;
                    vertical-align: middle;
                    white-space: nowrap;
                    &:last-child {
                        display: inline-block;
                        padding: 8px 12px;
                        vertical-align: middle;
                        > a {
                            color: rgb(102, 102, 102);
                            font-weight: normal;
                            text-decoration: none;
                            cursor: pointer;
                        }
                    }
                }
            }
        }
    }
</style>