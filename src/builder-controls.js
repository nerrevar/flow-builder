import { Raycaster, Vector2, Vector3 } from "three"

import Line from "./line"

import {
  PORT_COLOR,
  PORT_HOVER_COLOR,
  PORT_TEXT_COLOR,
  PORT_TEXT_HOVER_COLOR
} from "./settings"

export default class BuilderControls {
  constructor(element, scene, camera) {
    this.element = element
    this.scene = scene
    this.camera = camera
    this.raycaster = new Raycaster()
    this.mouse = new Vector2()

    const moveDisabler = e => e.stopPropagation()

    element.addEventListener("pointermove", e => {
      this.mouse.x = e.clientX / window.innerWidth * 2 - 1
      this.mouse.y = -1 * (e.clientY / window.innerHeight * 2 - 1)

      this.raycaster.setFromCamera(this.mouse, this.camera)
      this.intersection = this.raycaster.intersectObject(this.scene, true)

      // Reset port colors to default
      this.scene.children
        .filter(el => el.type === "Mesh")
        .forEach(el => el.children
          .filter(el => el.type === "Group")
          .forEach(el => el.children
            .forEach(el => el.material.color.setHex(
              el.name === "port" ? PORT_COLOR : PORT_TEXT_COLOR
            ))
          )
        )

      // Change port color on hover
      this.intersection
        .filter(el => el.object.parent.name === "port-group")
        .forEach(el => el.object.parent.children
          .forEach(el => el.material.color.setHex(
            el.name === "port" ? PORT_HOVER_COLOR : PORT_TEXT_HOVER_COLOR
          ))
        )
    })

    const onMove = moveEvt => {
      this.target.position.x = -1 * this.mouse.x * this.camera.left
      this.target.position.y = this.mouse.y * this.camera.top
    }

    const onMoveLine = moveEvt => {
      this.target.updateInput(
        new Vector3(
          -1 * this.mouse.x * this.camera.left,
          this.mouse.y * this.camera.top,
          0
        )
      )
    }

    const onMoveLineExisting = moveEvt => {
      this.target.userData.self.updateInput(
        new Vector3(
          -1 * this.mouse.x * this.camera.left,
          this.mouse.y * this.camera.top,
          0
        )
      )
    }

    element.addEventListener(
      "pointerdown",
      e => {
        this.target = this.intersection.filter(
          el => el.object.name === "port" ||
            el.object.name === "line" ||
            el.object.name.startsWith("node")
        )[0]?.object
        if (!this.target)
          return

        e.stopImmediatePropagation()

        if (this.target.name === "port") {
          const line = new Line(new Vector3(
            -1 * this.mouse.x * this.camera.left,
            this.mouse.y * this.camera.top,
            0
          ))
          this.target.add(line.mesh)
          this.target = line
          element.addEventListener("pointermove", onMoveLine)
          element.addEventListener(
            "pointerup",
            () => element.removeEventListener("pointermove", onMoveLine),
            { once: true }
          )
          return
        }

        if (this.target.name === "line") {
          element.addEventListener("pointermove", onMoveLineExisting)
          element.addEventListener(
            "pointerup",
            () => element.removeEventListener("pointermove", onMoveLineExisting),
            { once: true }
          )
          return
        }

        if (this.target.name.startsWith("node")) {
          element.addEventListener("pointermove", onMove)
          element.addEventListener(
            "pointerup",
            () => element.removeEventListener("pointermove", onMove),
            { once: true }
          )
          return
        }
      },
      { capture: true }
    )
  }
}
