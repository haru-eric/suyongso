<template>
    <div>
		<b-form-group class='mt-3'>
            <nuxt-link :to='`/board/${domain}`'>
                <b-button size='sm' variant='outline-primary' @click='forceUpdate'>
                    <font-awesome-icon icon='file-alt'/>
                    목록
                </b-button>
            </nuxt-link>
            <!-- <b-button size='sm' variant='outline-primary'>
                <font-awesome-icon icon='arrow-up'/>
                인기글
            </b-button> -->
            <nuxt-link :to='`/board/${domain}/write`'>
                <b-button
					class='float-right'
					size='sm'
					variant='outline-primary'
					v-shortkey.once='["w"]'
					@shortkey='$router.push({ path: "/board/" + domain + "/write" })'>
                    <font-awesome-icon icon='pencil-alt'/>
                    쓰기
                </b-button>
            </nuxt-link>
        </b-form-group>
		<div class='counter'>
			<strong>작성글</strong> {{ counts.count }} (어제 +{{ counts.yesterday }} / 오늘 +{{ counts.today }})
		</div>
		<div class='loading-bar' v-if='loading'>
			<ScaleLoader
				:height='16'
				:width='4'
				magin='2px'
				color='#fff'/>
		</div>
        <article class='desktop-only'>
            <h6>
                <div>번호</div>
                <div class='subject'>제목</div>
                <div>글쓴이</div>
                <div>날짜</div>
                <div>조회 수</div>
                <div>추천</div>
            </h6>
            <ul class='notice'>
                <li
                    :class='id == item.id ? "view" : ""'
                    v-for='item in notices' :key='item.id'>
                    <div>
						<span v-if='id == item.id'>
							<font-awesome-icon icon='angle-right' />
						</span>
						<span v-else>
							<strong>공지</strong>
						</span>
					</div>
                    <div class='subject'>
                        <nuxt-link :to='`/${item.id}?page=${page}${category !== "(없음)" ? "&category=" + category : ""}`'>
                            <strong>{{ item.title }}</strong>
                        </nuxt-link>
                        <nuxt-link :to='`/${item.id}?page=${page}${category !== "(없음)" ? "&category=" + category : ""}`' v-if='item.postsCount > 0'>
                            {{ item.postsCount }}
                        </nuxt-link>
                        <span v-if='item.isImage > 0'>
                            <font-awesome-icon icon='image' />
                        </span>
                    </div>
                    <div class='author'>
						<img :src='`/level/${item.level}.png`'>
            			<img class='icon' :src='`https://suyongso.co/icon/${item.icon}`' v-if='item.icon !== ""'>
						{{ item.author }}
					</div>
                    <div>{{ $moment(item.created).format('HH:mm:ss') }}</div>
                    <div>{{ numberWithCommas(item.hits) }}</div>
                    <div>{{ numberWithCommas(item.likes) }}</div>
                </li>
            </ul>
            <ul>
                <li
                    :class='id == item.id ? "view" : ""'
                    v-for='(item, index) in topics' :key='index'>
                    <div>
						<span v-if='id == item.id'>
							<font-awesome-icon icon='angle-right' />
						</span>
						<span v-else>
							{{ item.id }}
						</span>
					</div>
                    <div class='subject'>
                        <nuxt-link :to='`/${item.id}?page=${page}${category !== "(없음)" ? "&category=" + category : ""}`'>
                            {{ item.title }}
                        </nuxt-link>
                        <nuxt-link :to='`/${item.id}?page=${page}${category !== "(없음)" ? "&category=" + category : ""}`' v-if='item.postsCount > 0'>
                            {{ item.postsCount }}
                        </nuxt-link>
                        <span v-if='item.isImage > 0'>
                            <font-awesome-icon icon='image' />
                        </span>
                    </div>
                    <div class='author'>
						<img :src='`/level/${item.level}.png`'>
            			<img class='icon' :src='`https://suyongso.co/icon/${item.icon}`' v-if='item.icon !== ""'>
						{{ item.author }}
					</div>
                    <div>{{ $moment(item.created).format('HH:mm:ss') }}</div>
                    <div>{{ numberWithCommas(item.hits) }}</div>
                    <div>{{ numberWithCommas(item.likes) }}</div>
                </li>
            </ul>
        </article>
        <article class='mobile-only'>
<div class='topicList'>
      <div
        :class='id == item.id ? "item view" : "item odd"'
        v-for='item in notices' :key='item.id'>
        <div class='image' @click='move(item)'>
          <img :src='item.imageUrl ? "https://suyongso.co/img/thumb/" + item.imageUrl : "/default.png"'>
        </div>
        <div class='info' @click='move(item)'>
          <div class='subject'>
            <span class='board' v-if='domain === "all" || domain === "best"'>{{ getBoardName(item.boardDomain) }}</span>
            <span class='star' v-if='item.isBest > 0'>
              <img :src='item.isBest > 1 ? "/star.svg" : "/burn.svg"'>
            </span>
            <span class='view'>
              <span class='notice'>NOTICE</span>
              <span class='category' v-if='item.category !== ""'>{{ item.category }}</span>
              {{ item.title }}
              <span class='newest' v-if='$moment().diff($moment(item.created), "days") <= 1'>NEW</span>
              <span class='posts' v-if='item.postsCount > 0'>{{ numberWithCommas(item.postsCount) }}</span>
              <span class='image' v-if='item.isImage > 0'>
                <font-awesome-icon icon='image' />
              </span>
            </span>
          </div>
          <div class='author'>
            <img :src='`/level/${item.level}.png`'>
            <img class='icon' :src='`https://suyongso.co/icon/${item.icon}`' v-if='item.icon !== ""'>
            <span class='userTitle' v-if='item.userTitle'>{{ item.userTitle }}</span>
            {{ item.author }}
            <span class='event'>
              <font-awesome-icon icon='clock' />
              {{ $moment(item.created).format('YYYY/MM/DD HH:mm:ss') }}
            </span>
            <span class='event' v-if='item.hits > 0'>
              <font-awesome-icon icon='eye' />
              {{ numberWithCommas(item.hits) }}
            </span>
            <span class='event' v-if='item.likes > 0'>
              <font-awesome-icon icon='heart' />
              +{{ numberWithCommas(item.likes) }}
            </span>
          </div>
        </div>
        <div class='unlock' @click='unlockHandler(item.id)' v-if='$store.state.user.isAdmin > 0'>
          <font-awesome-icon icon='unlock-alt' />
        </div>
      </div>
      <div
        :class='id == item.id ? "item view" : (index % 2 === 0 ? "item" : "item odd")'
        v-for='(item, index) in topics' :key='index'>
        <div class='image' @click='move(item)'>
          <img :src='item.imageUrl ? "https://suyongso.co/img/thumb/" + item.imageUrl : "/default.png"'>
        </div>
        <div class='info' @click='move(item)'>
          <div class='subject'>
            <span class='board' v-if='domain === "all" || domain === "best"'>{{ getBoardName(item.boardDomain) }}</span>
            <span class='star' v-if='item.isBest > 0'>
              <img :src='item.isBest > 1 ? "/star.svg" : "/burn.svg"'>
            </span>
            <span :class='id == item.id ? "view" : ""'>
              <span class='category' v-if='item.category !== ""'>{{ item.category }}</span>
              {{ item.title }}
              <span class='newest' v-if='$moment().diff($moment(item.created), "days") <= 1'>NEW</span>
              <span class='posts' v-if='item.postsCount > 0'>{{ item.postsCount }}</span>
              <span v-if='item.isImage > 0'>
                <font-awesome-icon icon='image' />
              </span>
            </span>
          </div>
          <div class='author'>
            <img :src='`/level/${item.level}.png`'>
            <img class='icon' :src='`https://suyongso.co/icon/${item.icon}`' v-if='item.icon !== ""'>
            <span class='userTitle' v-if='item.userTitle'>{{ item.userTitle }}</span>
            {{ item.author }}
            <span class='event'>
              <font-awesome-icon icon='clock' />
              {{ $moment(item.created).format('YYYY/MM/DD HH:mm:ss') }}
            </span>
            <span class='event' v-if='item.hits > 0'>
              <font-awesome-icon icon='eye' />
              {{ numberWithCommas(item.hits) }}
            </span>
            <span class='event' v-if='item.likes > 0'>
              <font-awesome-icon icon='heart' />
              +{{ numberWithCommas(item.likes) }}
            </span>
          </div>
        </div>
      </div>
    </div>
        </article>
        <b-form-group class='mt-3'>
            <nuxt-link :to='`/board/${domain}`'>
                <b-button size='sm' variant='outline-primary' @click='forceUpdate'>
                    <font-awesome-icon icon='file-alt'/>
                    목록
                </b-button>
            </nuxt-link>
            <!-- <b-button size='sm' variant='outline-primary'>
                <font-awesome-icon icon='arrow-up'/>
                인기글
            </b-button> -->
            <nuxt-link :to='`/board/${domain}/write`'>
                <b-button
                    class='float-right'
                    size='sm'
					variant='outline-primary'
					v-shortkey.once='["w"]'
					@shortkey='$router.push({ path: "/board/" + domain + "/write" })'>
                    <font-awesome-icon icon='pencil-alt'/>
                    쓰기
                </b-button>
            </nuxt-link>
        </b-form-group>
        <div class='pagination'>
            <b-pagination-nav
                :link-gen='linkGen'
                :number-of-pages='100'
                v-model='page'
                size='sm'
                pills/>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['id', 'purePage', 'domain'],
        data() {
            return {
                category: '(없음)',
                categories: [],
                notices: [],
                topics: [],
                counts: {
					yesterday: 0,
                    today: 0,
                    count: 0
                },
                searches: {
                    text: '',
                    select: 0
                },
				page: Number(this.purePage),
				loading: false
            }
        },
        watch: {
            '$store.state.forceUpdate': function() {
                this.getData(true)
				this.getCount()
            },
            category: function() {
                this.page = 1
                this.getData(true)
                this.getCount()
            }
        },
        mounted() {
            this.category = this.$route.query.category || '(없음)'
            this.getData()
			this.getCount()
			this.realtimeUpdate()
        },
        methods: {
            getData: async function(forceUpdate = false) {
				this.loading = true
                this.$store.commit('setLoading', true)
                if (forceUpdate)
                    this.page = 1
                const data = await this.$axios.$post(
                    '/api/topic/list',
                    {
                        domain: this.domain,
                        category: this.category === '(없음)' ? '' : this.category,
                        searches: this.searches,
                        page: this.page - 1
                    }
                )
                this.categories = []
                this.notices = []
                if (data.categories)
                    this.categories = data.categories
                if (data.notices)
                    this.notices = data.notices
                this.topics = data.topics
				this.counts.count = data.count
				this.loading = false
                this.$store.commit('setLoading')
            },
            getCount: async function() {
                const data = await this.$axios.$get(`/api/topic/count/${this.domain}`)
                if (data.status === 'fail')
					return
				this.counts.yesterday = this.numberWithCommas(data.yesterday - data.today)
                this.counts.today = this.numberWithCommas(data.today)
            },
            search: async function() {
                if (this.searches.text === '')
                    return this.$message.error('검색어를 입력하세요.')
                if (this.searches.text.length < 2)
                    return this.$message.error('검색어는 두 글자 이상 입력하세요.')
                this.page = 1
                this.getData(true)
                this.getCount()
            },
            move(item) {
                this.$router.push({ path: `/${item.id}?page=${this.page}${this.category !== '(없음)' ? '&category=' + this.category : ''}` })
            },
            scrollTo() {
                this.$nextTick(() => {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    })
                })
            },
            linkGen(page) {
                return `/board/${this.domain}?page=${page}${this.category !== '(없음)' ? '&category=' + this.category : ''}`
            },
            forceUpdate() {
                this.$store.commit('forceUpdate')
            },
            realtimeUpdate() {
				setTimeout(async () => {
					this.getData()
					this.getCount()
					this.realtimeUpdate()
				}, 10000)
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
        }
    }
</script>

<style lang='less' scoped>
	.counter {
		display: inline-block;
		margin-bottom: .5rem;
		padding: 4px 8px;
		color: #666;
		font-size: 12px;
		border-radius: 500rem;
		background-color: #eee;
	}

	.loading-bar {
		width: 100%;
		background-color: #2D99E1;
		> div {
			width: 40px;
			margin: 0 auto;
			padding-top: 6px;
		}
	}

    article.desktop-only {
        margin-bottom: .5rem;
        > h6 {
            display: flex;
            margin: 0;
            border-top: 2px solid rgb(45, 153, 225);
            border-bottom: 1px solid rgb(153, 153, 153);
            > div {
                padding: 9px;
                font-size: 11px;
                font-weight: 700;
                text-align: center;
                vertical-align: middle;
                white-space: nowrap;
                &:nth-child(1) { width: 60px }
                &:nth-child(3) { width: 120px }
                &:nth-child(4) { width: 70px }
                &:nth-child(5) { width: 50px }
                &:nth-child(6) { width: 40px }
            }
            > .subject {
                flex: 1;
            }
        }
        > ul {
            margin: 0;
            padding: 0;
            list-style: none;
            &.notice > li {
                border-bottom: 1px solid #ddd;
                background-color: #f8f8f8;
                &:last-child { border-bottom: 1px solid #ddd }
            }
            > li {
                display: flex;
                vertical-align: middle;
                border-bottom: 1px solid #eee;
				background-color: #fff;
				&.view > .subject { font-weight: bold }
                > div {
                    padding: 8px 12px;
                    color: #555;
                    font-size: 11px;
                    text-align: center;
                    vertical-align: middle;
                    white-space: nowrap;
                    &.subject {
                        text-align: left;
                        > a {
                            color: #222;
                            font-size: 12px;
                            text-decoration: none;
                            white-space: normal;
                            word-break: break-all;
							cursor: pointer;
							&:visited {
								color: #aaa;
							}
                        }
                        > a:nth-child(2) {
                            color: rgb(204, 102, 102);
                            font-size: 11px;
                            font-weight: 700;
                            line-height: normal;
                            margin-left: 4px;
                            text-decoration: none;
                            white-space: nowrap;
                            cursor: pointer;
                        }
					}
					&.author {
						text-align: left;
						> img:nth-child(1) {
							margin-top: -3px;
						}
						> img:nth-child(2) {
							width: 16px;
							height: 16px;
							margin-top: -3px;
							border-radius: 2px;
						}
					}
                    &:nth-child(1) { width: 60px }
                    &:nth-child(3) { width: 120px }
                    &:nth-child(4) { width: 70px }
                    &:nth-child(5) { width: 50px }
                    &:nth-child(6) { width: 40px }
                }
                > .subject { flex: 1 }
                &:nth-child(odd) { background-color: #fbfbfb }
                // &:last-child { border-bottom: 0 }
            }
        }
    }

    .pagination {
        justify-content: center;
    }

  /* Topic List */
  .topicList {
    display: flex;
    flex-direction: column;
    border: 1px solid #EEE;
  }
  .topicList .item {
    display: flex;
    border-bottom: 1px solid #EEE;
    background: #FFF;
  }
  .topicList .item.odd,
  .topicList .item.view { background: #FBFBFB }
  .topicList .item.view { border-left: .3rem solid #2D99E1 }
  .topicList .item:hover,
  .topicList .item.view:hover {
    background: #F0F0F0;
    cursor: pointer;
  }
  .topicList .item .image {
    display: flex;
    flex-direction: column;
  }
  .topicList .item .image img {
    width: 3.5rem;
    height: 3.5rem;
    margin: .25rem;
    border-radius: .2rem;
    background: #FFF;
  }
  .topicList .item .info {
    display: flex;
    flex: 1;
    flex-direction: column;
    padding: .25rem;
    padding-left: 0;
  }
  .topicList .item .info .subject {
    color: #333;
    font-size: .8rem;
  }
  .topicList .item .info .subject span.board {
    padding: 0 .5rem;
    border-radius: 500rem;
    background: #29313D;
    color: #FFF;
    font-weight: bold;
  }
  .topicList .item .info .subject span.star img {
    width: 16px;
    height: 16px;
    vertical-align: top;
  }
  .topicList .item .info .subject span.notice,
  .topicList .item .info .subject span.category,
  .topicList .item .info .subject span.newest,
  .topicList .item .info .subject span.posts {
    padding: 0 .25rem;
    border-radius: .1rem;
    background: #ED1C24;
    color: #FFF;
    font-size: .7rem;
  }
  .topicList .item .info .subject span.category {
    background: #EAEAEA;
    color: #29313D;
  }
  .topicList .item .info .subject span.newest { background: #2D99E1 }
  .topicList .item .info .subject span.posts { background: #999 }
  .topicList .item .info .subject span.image { color: #2D99E1 }
  .topicList .item .info .subject span.view {
    color: #2D99E1;
    font-weight: bold;
  }
  .topicList .item .info .author {
    color: #333;
    font-size: .8rem;
    font-weight: bold;
  }
  .topicList .item .info .author img.icon {
    width: 23px;
    height: 23px;
    vertical-align: text-top;
  }
  .topicList .item .info .author span.userTitle {
    padding: 0 .25rem;
    background: #29313D;
    border-radius: .25rem;
    color: #FFF;
    font-size: .7rem;
  }
  .topicList .item .info .author span.event {
    margin-left: .25rem;
    color: #999;
    font-size: .7rem;
    font-weight: normal;
  }
  .topicList .item .unlock {
    display: flex;
    flex-direction: column;
    width: 3rem;
    background: #29313D;
    color: #FFF;
    font-size: 1rem;
    justify-content: center;
    align-items: center;
  }
  .topicList .item .unlock:hover {
    opacity: .8;
    cursor: pointer;
  }
</style>