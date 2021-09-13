import * as THREE from 'three'

const flowBuilder = {
  renderer: null,
  scene: null,
  camera: null,

  init() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    window.addEventListener(
      "resize",
      () => this.renderer.setSize(window.innerWidth, window.innerHeight)
    )
    document.querySelector("#three-entrypoint").appendChild(this.renderer.domElement)

    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x606060)

    this.camera = new THREE.OrthographicCamera(-10, 10, -10, 10, 1, 50)
    this.scene.add(this.camera)

    const light = new THREE.AmbientLight(0xffffff)
    this.scene.add(light)

    this.animate()
  },

  animate() {
    this.renderer.render(this.scene, this.camera)
    requestAnimationFrame(() => this.animate())
  },
}

flowBuilder.init()
