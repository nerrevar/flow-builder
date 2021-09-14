import "./style.sass"
import * as THREE from "three"

import Node from "./node"

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

import { BACKGROUND_COLOR } from "./settings"

export default class FlowBuilder {
  constructor() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    window.addEventListener(
      "resize",
      () => this.renderer.setSize(window.innerWidth, window.innerHeight)
    )
    document.querySelector("#three-entrypoint").appendChild(this.renderer.domElement)

    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(BACKGROUND_COLOR)

    this.camera = new THREE.OrthographicCamera(-10, 10, 10, -10, 0.1, 50)
    this.camera.position.z = 1
    this.camera.lookAt(this.scene.position)
    this.scene.add(this.camera)

    this.scene.add(new THREE.AxesHelper(10))
    new OrbitControls(this.camera, this.renderer.domElement)

    const light = new THREE.AmbientLight(0xffffff)
    this.scene.add(light)

    const node = new Node(
      "Test node",
      0,
      0,
      [{ text: "test input" }, { text: "test2 input", index: 0 }, { text: "inp3" }],
      [{ text: "test output" }]
    )
    this.scene.add(node.mesh)

    this.animate()
  }

  animate() {
    this.renderer.render(this.scene, this.camera)
    requestAnimationFrame(() => this.animate())
  }
}

new FlowBuilder()
