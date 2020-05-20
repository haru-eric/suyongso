<template>
    <article>
        <h6>
            <span>{{ subject }}</span>
            <nuxt-link :to='`/board/${domain}`'>더보기</nuxt-link>
        </h6>
        <div>
            <ul>
                <li v-for='(item, index) in topics' :key='index'>
                    <nuxt-link :to='`${item.id}`'>{{ item.title }}</nuxt-link>
                    <span>{{ $moment(item.created).format('HH:mm:ss') }}</span>
                </li>
            </ul>
        </div>
    </article>
</template>

<script>
    export default {
        props: ['subject', 'domain', 'topics']
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
                margin: 0;
                padding: 0;
                list-style: none;
                > li {
                    > a {
                        display: inline-block;
                        width: 388px;
                        height: 26px;
                        line-height: 26px;
                        padding: 1px 5px;
                        vertical-align: top;
                        color: rgb(51, 51, 51);
                        font-size: 12px;
                        text-decoration: none;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        word-wrap: normal;
                        overflow: hidden;
                        cursor: pointer;
                    }
                    > span {
                        display: inline-block;
                        min-width: 10px;
                        line-height: 1;
                        padding: 3px 6px;
                        color: #fff;
                        font-size: 10.8px;
                        font-weight: bold;
                        text-align: center;
                        vertical-align: baseline;
                        white-space: nowrap;
                        border-radius: 2.7px;
                        background-color: rgba(0, 0, 0, 0.2);
                    }
                }
            }
        }
    }
</style>