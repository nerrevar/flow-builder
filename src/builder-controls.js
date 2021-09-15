import { Raycaster, Vector2 } from "three"

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

    element.addEventListener("mousemove", e => {
      this.mouse.x = e.clientX / window.innerWidth * 2 - 1
      this.mouse.y = -1 * (e.clientY / window.innerHeight * 2 - 1)

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

      this.raycaster.setFromCamera(this.mouse, this.camera)
      const intersection = this.raycaster.intersectObject(this.scene, true)

      intersection
        .filter(el => el.object.parent.name === "port-group")
        .forEach(el => el.object.parent.children
          .forEach(el => el.material.color.setHex(
            el.name === "port" ? PORT_HOVER_COLOR : PORT_TEXT_HOVER_COLOR
          ))
        )
    })

    element.addEventListener(
      "click",
      e => {
        this.raycaster.setFromCamera(this.mouse, this.camera)
        const intersects = this.raycaster.intersectObjects(this.scene.children)

        if (intersects.length) {

        }
      },
    )
  }
}
