<template>
    <article>
        <h6>
            <span>{{ subject }}</span>
            <nuxt-link :to='`/board/${domain}`'>더보기</nuxt-link>
        </h6>
        <div>
            <ul>
                <li v-for='(item, index) in getTopics(0)' :key='index'>
                    <nuxt-link :to='`${item.id}`'>
                        <img :src='`https://suyongso.co/img/thumb/${item.imageUrl}`' @error='imageUrlAlt'>
                        <!-- <strong>OP</strong> -->
                        <div>{{ item.title }}</div>
                    </nuxt-link>
                </li>
            </ul>
            <ul>
                <li v-for='(item, index) in getTopics(3)' :key='index'>
                    <nuxt-link :to='`${item.id}`'>
                        <img :src='`https://suyongso.co/img/thumb/${item.imageUrl}`' @error='imageUrlAlt'>
                        <!-- <strong>OP</strong> -->
                        <div>{{ item.title }}</div>
                    </nuxt-link>
                </li>
            </ul>
        </div>
    </article>
</template>

<script>
    export default {
        props: ['subject', 'domain', 'topics'],
        methods: {
            getTopics(limit) {
                let list = []
                for (let i = limit; i < limit + 3; i++)
                    if (this.topics[i])
                        list.push(this.topics[i])
                return list
            },
            imageUrlAlt(event) {
                event.target.src = 'https://github.com/u3u.png'
            }
        }
    }
</script>

<style lang='less' scoped>
    article {
        width: 461px;
        border: 1px solid #ccc;
        > h6 {
            background-color: #fbfbfb;
            height: 24px;
            line-height: 24px;
            margin: 0;
            padding: 0 5px;
            > span {
                color: #333;
                font-size: 13px;
                font-weight: bold;
            }
            > a {
                float: right;
                color: rgb(85, 85, 85);
                font-size: 12px;
                text-decoration: none;
                cursor: pointer;
            }
        }
        > div {
            padding: 5px;
            border-top: 1px solid rgb(204, 204, 204);
            > ul {
                display: flex;
                justify-content: space-between;
                margin: 0;
                padding: 1px 5px;
                list-style: none;
                > li {
                    width: 135px;
                    > a {
                        position: relative;
                        text-decoration: none;
                        > img {
                            width: 135px;
                            height: 135px;
                        }
                        > strong {
                            position: absolute;
                            top: 60px;
                            left: 0;
                            width: 100%;
                            padding-top: 2px;
                            color: #fff;
                            font-size: 12px;
                            font-weight: 400;
                            text-align: center;
                            background-color: #000;
                            opacity: .6;
                        }
                        > div {
                            margin-top: 10px;
                            color: rgb(51, 51, 51);
                            font-size: 12px;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            word-wrap: normal;
                            overflow: hidden;
                        }
                    }
                }
                &:first-child {
                    margin-top: 1px;
                }
                &:last-child {
                    margin-top: 10px;
                }
            }
        }
    }
</style>