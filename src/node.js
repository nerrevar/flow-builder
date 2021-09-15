import * as THREE from "three"

import {
  HEADER_HEIGHT,
  FONT,
  FONT_SIZE,
  TEXT_PADDING,
  PORT_HEIGHT,
  NODE_COLOR,
  NODE_HEADER_COLOR,
  NODE_NAME_COLOR
} from "./settings"

import Port from "@/port"
// import Output from "./Output"

export default class Node {
  constructor(name, x = 0, y = 0, inputs = [], outputs = []) {
    this.name = name
    this.x = x
    this.y = y
    this.padding = {
      vertical: 0.15,
      horizontal: 0.15,
      center: 0.3,
      betweenPorts: 0.15,
    }
    this.manualSized = false
    this.defaultIndex = 1
    this.inputCount = 0
    this.outputCount = 0
    this.inputs = inputs
    this.outputs = outputs

    this.calculateTextWidths()
    this.resize()
    this.createMesh()

    for (let inp of inputs.sort((a,b) => a.index - b.index))
      this.addInput(inp)
    for (let out of outputs.sort((a,b) => b.index - a.index))
      this.addOutput(out)
  }

  calculateTextWidths() {
    this.maxInputTextWidth =
      Math.max(...this.inputs.map(el => el.text.length)) * TEXT_PADDING
    this.maxOutputTextWidth =
      Math.max(...this.outputs.map(el => el.text.length)) * TEXT_PADDING
  }

  resize() {
    if (this.manualSized)
      return

    this.width = this.padding.horizontal * 2 +
      this.maxInputTextWidth +
      this.padding.center +
      this.maxOutputTextWidth
    this.height = this.padding.vertical * 2 +
      (this.inputs.length + this.outputs.length) * PORT_HEIGHT +
      (this.inputs.length + this.outputs.length - 1) * this.padding.betweenPorts +
      this.padding.center
  }

  createMesh() {
    this.mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(this.width, this.height),
      new THREE.MeshBasicMaterial({ color: NODE_COLOR })
    )
    this.mesh.name = `node ${this.name}`
    this.mesh.position.set(this.x, this.y, 0)
    this.mesh.lookAt(this.x, this.y, 1)

    const header = new THREE.Mesh(
      new THREE.PlaneGeometry(this.width, HEADER_HEIGHT),
      new THREE.MeshBasicMaterial({ color: NODE_HEADER_COLOR })
    )
    header.position.y = this.y + this.height / 2 + HEADER_HEIGHT / 2
    this.mesh.add(header)

    const name = new THREE.Mesh(
      new THREE.TextBufferGeometry(this.name, {
        font: FONT,
        size: FONT_SIZE,
        height: 0.01
      }),
      new THREE.MeshBasicMaterial({ color: NODE_NAME_COLOR })
    )
    name.geometry.computeBoundingBox()
    name.position.y = this.y + this.height / 2 + HEADER_HEIGHT + FONT_SIZE
    name.position.x =
      this.x - this.width / 2 + name.geometry.boundingBox.min.x + TEXT_PADDING
    this.mesh.add(name)
  }

  addInput(inputParams) {
    const input = new Port(
      inputParams.index || this.defaultIndex++,
      this.x - this.width / 2,
      this.y + this.height / 2 -
        this.padding.vertical -
        this.inputCount++ * (PORT_HEIGHT + this.padding.betweenPorts),
      inputParams.text,
      true
    )
    this.mesh.add(input.mesh)
  }
  addOutput(outputParams) {
    const output = new Port(
      outputParams.index || this.defaultIndex++,
      this.x + this.width / 2,
      this.y - this.height / 2 +
        this.padding.vertical +
        this.outputCount++ * (PORT_HEIGHT + this.padding.betweenPorts),
      outputParams.text,
      false
    )
    this.mesh.add(output.mesh)
  }

}
