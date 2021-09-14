import * as THREE from "three"

import { TEXT_PADDING, PORT_HEIGHT } from "./settings"

import Port from "@/port"
// import Output from "./Output"

export default class Node {
  constructor(x = 0, y = 0, inputs = [], outputs = []) {
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
    this.maxInputTextWidth = Math.max(...this.inputs.map(el => el.text.length)) * TEXT_PADDING
    this.maxOutputTextWidth = Math.max(...this.outputs.map(el => el.text.length)) * TEXT_PADDING
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
      new THREE.MeshBasicMaterial({ color: 0x90ff90 })
    )
    this.mesh.name = "Node"
    this.mesh.position.set(this.x, this.y, 0)
    this.mesh.lookAt(this.x, this.y, 1)
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
    this.mesh.add(input.blockMesh)
    this.mesh.add(input.textMesh)
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
    this.mesh.add(output.blockMesh)
    this.mesh.add(output.textMesh)
  }

}
