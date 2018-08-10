import macro, { EVENT_ABORT, VOID } from 'vtk.js/Sources/macro';
import vtkMath from 'vtk.js/Sources/Common/Core/Math';
import vtkAbstractWidget from 'vtk.js/Sources/Interaction/Widgets2/AbstractWidget';
import vtkHandleRepresentation from 'vtk.js/Sources/Interaction/Widgets2/HandleRepresentation';
import vtkCoordinate from 'vtk.js/Sources/Rendering/Core/Coordinate';

// ----------------------------------------------------------------------------
// vtkHandleWidget methods
// ----------------------------------------------------------------------------

function vtkHandleWidget(publicAPI, model) {
  model.classHierarchy.push('vtkHandleWidget');

  //----------------------------------------------------------------------------
  // Public API methods
  //----------------------------------------------------------------------------

  // virtual override (vtkAbstractWidget)
  publicAPI.createDefaultRepresentation = () =>
    vtkHandleRepresentation.newInstance();

  //----------------------------------------------------------------------------

  publicAPI.selectAction = (callData) => {
    const state = publicAPI.getWidgetState();
    const { selected, position } = state.getData();

    if (selected) {
      return VOID;
    }

    const picker = model.representation.getEventIntersection(callData);
    if (picker.getActors().length) {
      const mouseCoords = [callData.position.x, callData.position.y];
      const objPos = position.getValue();
      const dop = publicAPI
        .getInteractor()
        .getCurrentRenderer()
        .getActiveCamera()
        .getDirectionOfProjection();

      const mouseWorld = publicAPI.displayToPlane(mouseCoords, objPos, dop);
      model.mouseOffset = [0, 0, 0];
      vtkMath.subtract(objPos, mouseWorld, model.mouseOffset);

      state.updateData({ selected: true });
      publicAPI.render();
      return EVENT_ABORT;
    }
    return VOID;
  };

  //----------------------------------------------------------------------------

  publicAPI.endSelectAction = (callData) => {
    const state = publicAPI.getWidgetState();
    if (state.getData().selected) {
      state.updateData({ selected: false });

      publicAPI.render();
    }
  };

  //----------------------------------------------------------------------------

  publicAPI.moveAction = (callData) => {
    const state = publicAPI.getWidgetState();
    const { selected, position } = state.getData();

    if (!selected) {
      return VOID;
    }

    const coords = [callData.position.x, callData.position.y];
    const objPos = position.getValue();
    const renderer = publicAPI.getInteractor().getCurrentRenderer();
    const camera = renderer.getActiveCamera();
    const dop = camera.getDirectionOfProjection();

    // plane point is object position, normal is dop
    const point = publicAPI.displayToPlane(coords, objPos, dop);
    if (point) {
      const newPos = [0, 0, 0];
      vtkMath.add(point, model.mouseOffset, newPos);

      position.setValue(...newPos);
      state.updateData({ position });
      publicAPI.render();
    }

    return EVENT_ABORT;
  };

  //----------------------------------------------------------------------------

  // Set listeners
  publicAPI.handleLeftButtonPress = publicAPI.selectAction;
  publicAPI.handleLeftButtonRelease = publicAPI.endSelectAction;
  publicAPI.handleMouseMove = publicAPI.moveAction;

  //----------------------------------------------------------------------------

  // initialize handle state
  publicAPI.setWidgetState({
    position: vtkCoordinate.newInstance(),
    size: 0.01,
    selected: false,
  });
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {};

// ----------------------------------------------------------------------------

export function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Inheritance
  vtkAbstractWidget.extend(publicAPI, model, initialValues);

  // Object methods
  vtkHandleWidget(publicAPI, model);
}

// ----------------------------------------------------------------------------

export const newInstance = macro.newInstance(extend, 'vtkHandleWidget');

// ----------------------------------------------------------------------------

export default { newInstance, extend };
