import * as THREE from "three"

// import Input from "./Input"
// import Output from "./Output"

export default class Node {
  constructor(x = 0, y = 0, inputs = [], outputs = []) {
    this.x = x
    this.y = y
    this.padding = {
      vertical: 0.15,
      horizontal: -0.15,
      center: 0.15,
      interPort: 0.15,
    }
    this.manualSized = false
    this.inputs = inputs
    this.outputs = outputs

    // for (let inp of inputs)
    //   this.addInput(new Input)
    // for (let out of outputs)
    //   this.addOutput(new Output)

    this.calculateTextWidths()
    this.resize()
    this.createMesh()
  }

  calculateTextWidths() {
    this.maxInputTextWidth = Math.max(...this.inputs.map(el => el.text.length)) * 0.05
    this.maxOutputTextWidth = Math.max(...this.outputs.map(el => el.text.length)) * 0.05
  }

  resize() {
    if (this.manualSized)
      return

    this.width = this.padding.horizontal * 2 +
      this.maxInputTextWidth +
      this.padding.center +
      this.maxOutputTextWidth
    this.height = this.padding.vertical * 2 +
      (this.inputs.length + this.outputs.length) * this.padding.interPort +
      this.padding.center
  }

  createMesh() {
    this.mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(this.width, this.height),
      new THREE.MeshBasicMaterial({ color: 0x90ff90 })
    )
    this.mesh.position.set(this.x, this.y, 0)
    this.mesh.lookAt(this.x, this.y, 1)
  }

  addInput() {}
  addOutput() {}

}
