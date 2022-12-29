
import startUp from "./startUp"
import { setPathParams } from '../../store/pathParams'

function appStart(options: any) {
  setPathParams(options)
  startUp()
}

export default appStart