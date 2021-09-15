import * as THREE from "three"

export default class Line {
  constructor(outputPosition) {
    this.outputPosition = outputPosition
    this.points = new THREE.SplineCurve([
      new THREE.Vector3(),
      new THREE.Vector3()
    ]).getPoints(50)

    this.geometry = new THREE.BufferGeometry().setFromPoints(this.points)
    this.mesh = new THREE.Line(
      this.geometry,
      new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 3 })
    )
    this.mesh.name = "line"
  }

  updateInput(inputPosition) {
    this.points = new THREE.SplineCurve([
      this.points[0],
      new THREE.Vector3(
        this.points[0].x +
          Math.abs(
            this.points[this.points.length - 1].x - this.points[0].x
          ) * 0.3,
        this.points[0].y +
          (this.points[this.points.length - 1].y - this.points[0].y) * 0.1,
        0
      ),
      new THREE.Vector3(
        this.points[this.points.length - 1].x -
          Math.abs(
            this.points[this.points.length - 1].x - this.points[0].x
          ) * 0.3,
        this.points[this.points.length - 1].y -
          (this.points[this.points.length - 1].y - this.points[0].y) * 0.1,
        0
      ),
      new THREE.Vector3().subVectors(inputPosition, this.outputPosition)
    ]).getPoints(50)
    this.geometry.setFromPoints(this.points)
  }
}
