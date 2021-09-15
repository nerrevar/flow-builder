import * as THREE from "three"
import { mergeBufferGeometries } from "three/examples/jsm/utils/BufferGeometryUtils"

import {
  FONT,
  FONT_SIZE,
  PORT_WIDTH,
  PORT_HEIGHT,
  TEXT_PADDING,
  PORT_COLOR,
  PORT_TEXT_COLOR
} from "./settings"

export default class Port {
  constructor(index, x, y, text, isInput) {
    if (!index)
      console.error("Invalid port index!")
    this.index = index
    this.x = x
    this.y = y
    this.text = text || `Port ${index}`
    this.isInput = isInput

    this.createMeshes()
  }

  createMeshes() {
    const blockMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(PORT_WIDTH, PORT_HEIGHT),
      new THREE.MeshBasicMaterial({ color: PORT_COLOR })
    )
    blockMesh.name = "port"
    blockMesh.position.y = this.isInput ?
      this.y - PORT_HEIGHT / 2 :
      this.y + PORT_HEIGHT / 2
    blockMesh.position.x = this.isInput ?
      this.x - PORT_WIDTH / 2 :
      this.x + PORT_WIDTH / 2

    const textMesh = new THREE.Mesh(
      new THREE.TextBufferGeometry(this.text, {
        font: FONT,
        size: FONT_SIZE,
        height: 0.01
      }),
      new THREE.MeshBasicMaterial({ color: PORT_TEXT_COLOR })
    )
    textMesh.name = "text"
    textMesh.geometry.computeBoundingBox()
    textMesh.position.y = this.isInput ?
      this.y - PORT_HEIGHT / 2 :
      this.y + PORT_HEIGHT / 2
    textMesh.position.x = this.isInput ?
      this.x + textMesh.geometry.boundingBox.min.x + TEXT_PADDING :
      this.x - textMesh.geometry.boundingBox.max.x - TEXT_PADDING

    this.mesh = new THREE.Group()
    this.mesh.name = "port-group"
    this.mesh.add(blockMesh)
    this.mesh.add(textMesh)
  }
}
