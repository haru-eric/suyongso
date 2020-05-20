<template>
    <div>
        <article class='best'>
            <h2>
                <span>애니동 일간베스트</span>
                <nuxt-link to='/best'>
                    <font-awesome-icon icon='plus'/>
                </nuxt-link>
            </h2>
            <div class='list'>
                <ul>
                    <li><nuxt-link to='/'>테스트</nuxt-link></li>
                    <li><nuxt-link to='/'>테스트</nuxt-link></li>
                    <li><nuxt-link to='/'>테스트</nuxt-link></li>
                    <li><nuxt-link to='/'>테스트</nuxt-link></li>
                    <li><nuxt-link to='/'>테스트</nuxt-link></li>
                </ul>
            </div>
        </article>
        <article class='counter'>
            <span>
                <font-awesome-icon icon='file-alt'/>
                14,334(<span>+643</span>)
            </span>
        </article>
        <article class='side'>
            <ul>
                <li>
                    <nuxt-link to='/board/notice'>공지사항</nuxt-link>
                </li>
                <li>
                    <nuxt-link to='/board/feedback'>건의사항</nuxt-link>
                </li>
                <!-- <li>
                    <nuxt-link to='/anime'>애니 편성표</nuxt-link>
                </li> -->
            </ul>
        </article>
        <article class='side'>
            <ul>
                <li class='active'>
                    <nuxt-link to='/board/anime'>애니동</nuxt-link>
                </li>
                <li>
                    <nuxt-link to='/board/game'>게임동</nuxt-link>
                </li>
                <li>
                    <nuxt-link to='/board/nendo'>넨도동</nuxt-link>
                </li>
                <li>
                    <nuxt-link to='/board/manga'>만화동</nuxt-link>
                </li>
                <li>
                    <nuxt-link to='/board/draw'>그림동</nuxt-link>
                </li>
                <li>
                    <nuxt-link to='/board/news'>뉴스동</nuxt-link>
                </li>
                <li>
                    <nuxt-link to='/board/review'>리뷰동</nuxt-link>
                </li>
            </ul>
        </article>
        <article class='service'>
            <nuxt-link to='/'>
                <font-awesome-icon icon='music'/>
                RADIO
            </nuxt-link>
        </article>
        <article class='shortcut'>
            <nuxt-link to='/1784'>
                <font-awesome-icon icon='check-square'/>
                수용소 단축키 안내
            </nuxt-link>
        </article>
    </div>
</template>

<style lang='less' scoped>
    article.best {
        border: 1px solid #eee;
        background-color: #fff;
        > h2 {
            height: 30px;
            line-height: 30px;
            margin-bottom: 5px;
            padding: 0px 10px;
            font-size: 14px;
            border-bottom: 1px solid #ddd;
            > span {
                color: #666;
                font-weight: bold;
            }
            > a {
                float: right;
                color: #999;
            }
        }
        > .list {
            padding: 0px 5px;
            > ul {
                margin: 0;
                padding: 0;
                list-style: none;
                > li > a {
                    height: 26px;
                    line-height: 26px;
                    padding: 1px 5px;
                    color: #333;
                    font-size: 12px;
                    text-decoration: none;
                    overflow: hidden;
                }
            }
        }
    }

    article.side {
        margin-top: 10px;
        border: 1px solid #eee;
        border-radius: 2px;
        background-color: #fff;
        > ul {
            margin: 0;
            padding: 0;
            list-style: none;
            > li {
                padding: 10px 20px;
                &.active {
                    background-color: #7F859A;
                    > a {
                        color: #fff;
                    }
                }
                > a {
                    display: block;
                    line-height: 20px;
                    color: rgb(119, 119, 119);
                    font-size: 14px;
                    text-decoration: none;
                }
            }
        }
    }

    article.counter {
        margin-top: 10px;
        padding: 0px;
        border: 1px solid rgb(45, 153, 225);
        border-radius: 2px;
        background-color: #fff;
        > span {
            line-height: 2;
            margin: 5px;
            color: rgb(45, 153, 225);
            font-size: 15px;
            font-weight: bold;
            > svg {
                font-size: 14px;
            }
            > span {
                color: rgb(45, 180, 0);
            }
        }
    }

    article.service {
        margin-top: 10px;
        a:nth-child(1) {
            display: inline-block;
            width: 100%;
            line-height: 22px;
            padding: 8px 16px;
            color: #fff;
            font-size: 20px;
            text-align: center;
            text-decoration: none;
            border: 1px solid #4A89DC;
            border-radius: 4px;
            background-color: #5D9CEC;
            cursor: pointer;
        }
    }

    article.shortcut {
        margin-top: 10px;
        padding-left: 6px;
        border: 1px solid #BCE8F1;
        border-radius: 3px;
        background-color: #D9EDF7;
        a {
            color: #3A87AD;
            font-size: 13px;
            font-weight: bold;
            text-decoration: none;
        }
    }
</style>