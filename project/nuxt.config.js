module.exports = {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: '로리캠△ - 서브컬쳐 커뮤니티',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/sub-icon.png' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Nunito&display=swap' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#2D99E1' },
  /*
  ** Global CSS
  */
  css: [
    '~/assets/stylesheets.less',
    '~/assets/vue-toastification.css'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/socket.io.js',
    { src: '~/plugins/vue-aplayer.js', ssr: false },
    { src: '~/plugins/vue-spinners.js', ssr: false },
    { src: '~/plugins/vue-toastification.js', ssr: false },
    { src: '@/plugins/vue-shortkey.js', mode: 'client' }
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxtjs/eslint-module',
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    'bootstrap-vue/nuxt',
    'nuxt-fontawesome',
    'nuxt-clipboard2',
    '@nuxtjs/proxy',
    ['@nuxtjs/axios', { proxy: true }],
    ['@nuxtjs/recaptcha', {
      hideBadge: true,
      siteKey: '6LfHQ70UAAAAAGSDxOcdcP0eAJLpelwsdMvgZPke',
      version: 3
    }],
    //['@nuxtjs/google-analytics',{
    // id: 'UA-127341158-2'}],
    ['@nuxtjs/google-adsense'],
    ['@nuxtjs/moment', ['ko']],
  ],
  'google-adsense': {
    id: 'ca-pub-5633529273423665'
  },
  fontawesome: {
    imports: [
      {
        set: '@fortawesome/free-solid-svg-icons',
        icons: ['fas']
      }
    ]
  },
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
  },
  /*
  ** Build configuration
  */
  build: {
    babel: {
      presets({ isServer }) {
        return [
          [
            require.resolve('@nuxt/babel-preset-app'),
            // require.resolve('@nuxt/babel-preset-app-edge'), // For nuxt-edge users
            {
              buildTarget: isServer ? 'server' : 'client',
              corejs: { version: 3 }
            }
          ]
        ]
      }
    },
    vendor: ['vuex', 'socket.io-client'],
  },
  proxy: {
    '/api': 'http://localhost:3000'
  },
  env: {
    SOCKET_HOST_URL: 'https://suyongso.co'
  },
}