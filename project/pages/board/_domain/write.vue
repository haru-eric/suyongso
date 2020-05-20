<template>
    <article class='writeBox'>
		<b-form-group label='제목'>
			<b-form-input placeholder='제목' v-model='form.title' trim autofocus/>
		</b-form-group>
		<client-only>
			<div class='editor'>
				<editor-menu-bar :editor='editor' v-slot='{ commands, isActive }'>
					<div>
						<b-button-group vertical>
							<b-button-group size='sm'>
								<b-dropdown variant='primary' size='sm'>
									<template v-slot:button-content>
										<font-awesome-icon icon='heading'/>
										Header
									</template>
									<b-dropdown-item @click='commands.heading({ level: 1 })'>H1</b-dropdown-item>
									<b-dropdown-item @click='commands.heading({ level: 2 })'>H2</b-dropdown-item>
									<b-dropdown-item @click='commands.heading({ level: 3 })'>H3</b-dropdown-item>
									<b-dropdown-item @click='commands.heading({ level: 4 })'>H4</b-dropdown-item>
									<b-dropdown-item @click='commands.heading({ level: 5 })'>H5</b-dropdown-item>
									<b-dropdown-item @click='commands.heading({ level: 6 })'>H6</b-dropdown-item>
								</b-dropdown>
								<b-button
									variant='primary'
									:pressed.sync='isActive.bold()'
									@click='commands.bold'>
									<font-awesome-icon icon='bold'/>
								</b-button>
								<b-button
									variant='primary'
									:pressed.sync='isActive.italic()'
									@click='commands.italic'>
									<font-awesome-icon icon='italic'/>
								</b-button>
								<b-button
									variant='primary'
									:pressed.sync='isActive.strike()'
									@click='commands.strike'>
									<font-awesome-icon icon='strikethrough'/>
								</b-button>
								<b-button
									variant='primary'
									:pressed.sync='isActive.underline()'
									@click='commands.underline'>
									<font-awesome-icon icon='underline'/>
								</b-button>
								<b-button
									variant='primary'
									:pressed.sync='isActive.code()'
									@click='commands.code'>
									<font-awesome-icon icon='code'/>
								</b-button>
							</b-button-group>
							<b-button-group size='sm'>
								<b-button
									variant='primary'
									:pressed.sync='isActive.paragraph()'
									@click='commands.paragraph'>
									<font-awesome-icon icon='paragraph'/>
								</b-button>
								<b-button
									variant='primary'
									:pressed.sync='isActive.bullet_list()'
									@click='commands.bullet_list'>
									<font-awesome-icon icon='list-ul'/>
								</b-button>
									<b-button
									variant='primary'
									:pressed.sync='isActive.ordered_list()'
									@click='commands.ordered_list'>
									<font-awesome-icon icon='list-ol'/>
								</b-button>
								<b-button
									variant='primary'
									:pressed.sync='isActive.blockquote()'
									@click='commands.blockquote'>
									<font-awesome-icon icon='quote-right'/>
								</b-button>
								<b-button
									variant='primary'
									:pressed.sync='isActive.code_block()'
									@click='commands.code_block'>
									<font-awesome-icon icon='code'/>
								</b-button>
								<b-button
									variant='primary'
									@click='commands.horizontal_rule'>
									<font-awesome-icon icon='ruler-horizontal'/>
								</b-button>
								<b-button
									variant='primary'
									@click='commands.undo'>
									<font-awesome-icon icon='undo'/>
								</b-button>
								<b-button
									variant='primary'
									@click='commands.redo'>
									<font-awesome-icon icon='redo'/>
								</b-button>
								<!-- <b-button
									variant='primary'
									@click='insertHTML(editor, `<img src='https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png'>`)'>
									<font-awesome-icon icon='image'/>
								</b-button> -->
							</b-button-group>
						</b-button-group>
						<b-button-group vertical>
							<b-button-group size='sm'>
								<b-button variant='warning' @click='htmlMode = !htmlMode'>
									<font-awesome-icon icon='edit'/>
									{{ htmlMode ? 'HTML' : '에디터' }}
								</b-button>
							</b-button-group>
							<b-button-group size='sm'>
								<b-button @click='clearContent'>
									<font-awesome-icon icon='poll'/>
									설문조사
								</b-button>
							</b-button-group>
						</b-button-group>
					</div>
				</editor-menu-bar>
				<div v-if='htmlMode'>
					<textarea
						class='textBox'
						placeholder='이곳에 내용을 입력하세요.'
						@change='changeContent'
						v-model='html' />
				</div>
				<div v-else>
					<editor-content class='textBox' :editor='editor'/>
				</div>
			</div>
			<div class='editor' slot='placeholder'>
				<b-spinner variant='primary' style='width: 3rem; height: 3rem' label='Large Spinner' type='grow'/>
			</div>
		</client-only>
		<dropzone
			id='dropzone'
			ref='dropzone'
			:options='options'
			:include-styling='true'
			v-on:vdropzone-thumbnail='thumbnail'
			:destroyDropzone='true'
			:useCustomSlot='true'>
			<div class='dropzone-custom-content'>
				<h3 class='dropzone-custom-title'>
					<font-awesome-icon icon='image'/>
					이미지 첨부
				</h3>
				<p class='subtitle'>이곳에 이미지를 드롭하세요...</p>
			</div>
		</dropzone>
		<b-button-group class='submit'>
			<b-button variant='primary' @click='submit'>
				<font-awesome-icon icon='pen'/>
				작성 완료
			</b-button>
		</b-button-group>
    </article>
</template>

<script>
    import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
    import {
        Blockquote,
        CodeBlock,
        HardBreak,
        Heading,
        Image,
        HorizontalRule,
        OrderedList,
        BulletList,
        ListItem,
        TodoItem,
        TodoList,
        Bold,
        Code,
        Italic,
        Link,
        Strike,
        Underline,
        History
    } from 'tiptap-extensions'
    import { DOMParser } from 'prosemirror-model'
    import Dropzone from 'nuxt-dropzone'
    import 'nuxt-dropzone/dropzone.css'

    export default {
        components: {
            EditorContent,
            EditorMenuBar,
            Dropzone
        },
        data() {
            return {
                editor: null,
                html: '<p></p>',
                options: {
					url: 'https://httpbin.org/anything',
					previewTemplate: this.template()
				},
				domain: '',
				categories: [],
				form: {
					category: '(없음)',
					title: '',
					content: '<p></p>',
					isNotice: false
				},
				charts: {
					content: '',
					hide: true
				},
				images: [],
				htmlMode: false,
				loading: false
            }
		},
		async asyncData ({ params, $axios }) {
			const domain = params.domain
			const data = await $axios.$get(`/api/topic/categories/${domain}`)
			return { domain, categories: data }
		},
        mounted() {
            this.editor = new Editor({
				// autoFocus: true,
                extensions: [
                    new Blockquote(),
                    new BulletList(),
                    new CodeBlock(),
                    new HardBreak(),
                    new Heading({
                        levels: [1, 2, 3]
                    }),
                    new Image(),
                    new HorizontalRule(),
                    new ListItem(),
                    new OrderedList(),
                    new TodoItem(),
                    new TodoList(),
                    new Link(),
                    new Bold(),
                    new Code(),
                    new Italic(),
                    new Strike(),
                    new Underline(),
                    new History()
                ],
                content: '<p></p>',
                onUpdate: ({ getHTML }) => this.html = getHTML()
            })
			const instance = this.$refs.dropzone.dropzone
			const editor = this.editor
			const getContent = this.getContent
			const setContent = this.setContent
			const insertHTML = this.insertHTML
			this.$refs.dropzone.dropzone.on('addedfile', function(file) {
				insertHTML(editor, `<p><img src='${URL.createObjectURL(file)}' alt='${file.upload.uuid}'></p>`)
			})
			this.$refs.dropzone.dropzone.on('removedfile', function(file) {
				const regex = new RegExp(`<img\\s+[^>]*alt=('|")${file.upload.uuid}('|")[^>]*>`, 'gi')
				setContent(getContent().replace(regex, ''))
			})
		},
        methods: {
			getContent() {
				return this.html
			},
            setContent(html) {
                this.editor.setContent(html, true)
			    this.editor.focus()
			},
			changeContent() {
    			this.editor.setContent(this.html, true)
			    this.editor.focus()
			},
            clearContent() {
                this.editor.clearContent(true)
				this.editor.focus()
			},
            elementFromString(value) {
                const element = document.createElement('p')
                element.innerHTML = value
                return element
            },
            insertHTML({
                state,
                view
            }, value) {
                const {selection} = state
                const element = this.elementFromString(value)
                const slice = DOMParser
                    .fromSchema(state.schema)
                    .parseSlice(element)
                const transaction = state
                    .tr
                    .insert(selection.anchor, slice.content)
                view.dispatch(transaction)
			},
			async submit() {
				if (this.loading)
					return
				if (!this.$store.state.user.isLogged)
					return this.toast('로그인하세요.', 'warning')
				if (this.form.title === '')
					return this.toast('제목을 입력하세요.', 'danger')
				if (this.html === '' || this.html === '<p></p>')
					return this.toast('본문을 입력하세요.', 'danger')
				this.loading = true
				await this.imageUploadToServer(this.$refs.dropzone.getAcceptedFiles())
			},
			async write() {
				const token = this.$store.state.user.token
				const data = await this.$axios.$post('/api/topic/write',
					{
						domain: this.domain,
						isNotice: this.form.isNotice,
						category: this.form.category === '(없음)' ? '' : this.form.category,
						title: this.form.title,
						content: this.html,
						charts: this.charts.content,
						images: this.images
					}, { headers: { 'x-access-token': token } }
				)
				if (data.status === 'fail') {
					this.loading = false
					return this.toast(data.message || '오류가 발생했습니다.', 'danger')
				}
				this.$router.push({ path: `/${data.topicId}` })
			},
			imageUploadToServer: async function(files, index = 0) {
				if (index >= files.length)
					return await this.write()
				const file = files[index]
				const LIMITS = 10485760
				const formData = new FormData()
				formData.append('type', 'file')
				formData.append('image', file, file.name)
				if (!/(.gif|.png|.jpg|.jpeg|.webp)/i.test(file.name))
					this.toast(`${index + 1}번째 이미지 업로드 실패... (gif, png, jpg, jpeg, webp만 가능)`, 'danger')
				else if (file.size > LIMITS)
					this.toast(`${index + 1}번째 이미지 업로드 실패... (10MB 이하만 업로드 가능)`, 'danger')
				else {
					const data = await this.$axios.$post(
						'/api/cloud/topic',
						formData,
						{ headers: { 'content-type': 'multipart/form-data' } }
					)
					if (data.status === 'ok') {
						const name = file.name
						const filename = `/img/${data.filename}`
						this.toast(`${index + 1}번째 이미지 (${name}) 업로드 성공!`, 'success')
						this.images.push({
							name,
							filename: data.filename,
							link: filename,
							uuid: file.upload.uuid
						})
						const regex = new RegExp(`<img\\s+[^>]*alt=('|")${file.upload.uuid}('|")[^>]*>`, 'gi')
						const text = `<img src="${filename}" alt="${file.upload.uuid}">`
						this.setContent(this.html.replace(regex, text))
					} else {
						this.toast(`${index + 1}번째 이미지 업로드 실패...`, 'danger')
					}
				}
				await this.imageUploadToServer(files, index + 1)
			},
			template: function () {
				return `<div class="dz-preview dz-file-preview">
							<div class="dz-image">
								<div data-dz-thumbnail-bg></div>
							</div>
							<div class="dz-details">
								<div class="dz-size"><span data-dz-size></span></div>
							</div>
							<div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>
							<div class="dz-error-message"><span data-dz-errormessage></span></div>
							<div class="dz-success-mark"><i class="fa fa-check"></i></div>
							<div class="dz-error-mark"><i class="fa fa-close"></i></div>
							<a class="dz-remove" data-dz-remove>삭제</a>
						</div>`
			},
			thumbnail: function(file, dataUrl) {
				var j, len, ref, thumbnailElement
				if (file.previewElement) {
					file.previewElement.classList.remove('dz-file-preview')
					ref = file.previewElement.querySelectorAll('[data-dz-thumbnail-bg]')
					for (j = 0, len = ref.length; j < len; j++) {
						thumbnailElement = ref[j]
						thumbnailElement.alt = file.name
						thumbnailElement.style.backgroundImage = 'url("' + dataUrl + '")'
					}
					return setTimeout(((function(_this) {
						return function() {
							return file.previewElement.classList.add('dz-image-preview')
						}
					})(this)), 1)
				}
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
	article {
		padding: 5px;
		border: 1px solid #eee;
	}

	.client-only-placeholder {
		height: 385px;
		line-height: 385px;
		color: #999;
		font-size: 1.2rem;
		text-align: center;
	}

    .textBox {
		width: 100%;
		min-height: 300px;
		margin: .5rem 0;
        padding: .5rem;
		border: 2px solid #e5e5e5;
	}

	textarea.textBox { margin-bottom: 2px }

	.submit { margin: 1rem 0 }
</style>