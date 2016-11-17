import * as grids from './Grids'
import * as planes from './Planes'
import CamViewControls from './controls/CamViewControls2'
// import * as objectEffects from './objectEffects'

import AnnotationVisual from './annotations/AnnotationVisual'
import DistanceVisual from './annotations/DistanceVisual'
import NoteVisual from './annotations/NoteVisual.js'
import DiameterVisual from './annotations//DiameterVisual.js'
import AngleVisual from './annotations//AngleVisual.js'
import ThicknessVisual from './annotations//ThicknessVisual.js'

const annotations = {AnnotationVisual, DistanceVisual, NoteVisual, DiameterVisual, AngleVisual, ThicknessVisual}

// import ZoomInOnObject from './objectEffects/zoomInOnObject'

import zoomInOn from './cameraEffects/zoomInOn'
import zoomToFit from './cameraEffects/zoomToFit'

const cameraEffects = {zoomInOn, zoomToFit}

import centerMesh from './meshTools/centerMesh'
import resizeMesh from './meshTools/resizeMesh'
import {computeBoundingBox, computeBoundingSphere} from './meshTools/computeBounds'

const meshTools = {centerMesh, resizeMesh, computeBoundingBox, computeBoundingSphere}

export { grids, planes, meshTools, CamViewControls, cameraEffects, annotations }
