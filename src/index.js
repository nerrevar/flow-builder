import "./style.sass"
import * as THREE from "three"

import Node from "./node"

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import BuilderControls from "./builder-controls"

import { BACKGROUND_COLOR } from "./settings"

export default class FlowBuilder {
  constructor() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setPixelRatio( window.devicePixelRatio )
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    window.addEventListener(
      "resize",
      () => this.renderer.setSize(window.innerWidth, window.innerHeight)
    )
    document.querySelector("#three-entrypoint").appendChild(this.renderer.domElement)

    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(BACKGROUND_COLOR)

    this.camera = new THREE.OrthographicCamera(-5, 5, 5, -5, 0.1, 50)
    this.camera.position.z = 1
    this.camera.lookAt(this.scene.position)
    this.scene.add(this.camera)

    const light = new THREE.AmbientLight(0xffffff)
    this.scene.add(light)

    // Debug
    // this.scene.add(new THREE.AxesHelper(10))
    // this.scene.add(new THREE.CameraHelper(this.camera))

    new BuilderControls(this.renderer.domElement, this.scene, this.camera)

    const controls = new OrbitControls(this.camera, this.renderer.domElement)
    controls.mouseButtons = {
      LEFT: THREE.MOUSE.PAN,
      MIDDLE: THREE.MOUSE.DOLLY,
    }

    const node = new Node(
      "Test node",
      0,
      0,
      [{ text: "test input" }, { text: "test2 input", index: 0 }, { text: "inp3" }],
      [{ text: "test output" }]
    )
    this.scene.add(node.mesh)
    const node2 = new Node(
      "Node 2",
      3,
      2,
      [{ text: "inp" }],
      [{ text: "out" }]
    )
    this.scene.add(node2.mesh)

    this.animate()
  }

  animate() {
    this.renderer.render(this.scene, this.camera)
    requestAnimationFrame(() => this.animate())
  }
}

new FlowBuilder()
