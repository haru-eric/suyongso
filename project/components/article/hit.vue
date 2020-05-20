<template>
    <article>
        <h6>
            <span>HIT 갤러리</span>
            <nuxt-link to='/hit'>더보기</nuxt-link>
        </h6>
        <div>
            <ul>
                <li v-for='(item, index) in topics' :key='index'>
                    <nuxt-link :to='`${item.id}`'>
                        <img :src='`https://suyongso.co/img/thumb/${item.imageUrl}`' @error='imageUrlAlt'>
                        <strong>OP</strong>
                        <div>{{ item.title }}</div>
                    </nuxt-link>
                </li>
            </ul>
        </div>
    </article>
</template>

<script>
    export default {
        props: ['topics'],
        methods: {
            imageUrlAlt(event) {
                event.target.src = 'https://github.com/u3u.png'
            }
        }
    }
</script>

<style lang='less' scoped>
    article {
        width: 100%;
        border: 1px solid #ccc;
        > h6 {
            background-color: #fbfbfb;
            height: 24px;
            line-height: 24px;
            margin: 0;
            padding: 0 5px;
            > span {
                color: rgb(45, 153, 225);
                font-size: 14px;
                font-weight: 700;
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
                    width: 168px;
                    > a {
                        position: relative;
                        text-decoration: none;
                        > img {
                            width: 168px;
                            height: 135px;
                        }
                        > strong {
                            position: absolute;
                            left: 0;
                            bottom: 56px;
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
            }
        }
    }
</style>