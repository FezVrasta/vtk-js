import vtkSpline1D from 'vtk.js/Sources/Common/DataModel/Spline1D';


interface ICardinalSpline1DInitialValues {}

export interface vtkCardinalSpline1D extends vtkSpline1D {

	/**
	 * 
	 * @param {Number} size 
	 * @param {Float32Array} work 
	 * @param {Number[]} x 
	 * @param {Number[]} y 
	 */
	computeCloseCoefficients(size: number, work: Float32Array, x: number[], y: number[]): void;
		
	/**
	 * 
	 * @param {Number} size 
	 * @param {Float32Array} work 
	 * @param {Number[]} x 
	 * @param {Number[]} y 
	 */
	computeOpenCoefficients(size: number, work: Float32Array, x: number[], y: number[]): void;
		
	/**
	 * 
	 * @param {Number} intervalIndex 
	 * @param {Number} t 
	 */
	getValue(intervalIndex: number, t: number): number;
}

/**
 * Method used to decorate a given object (publicAPI+model) with vtkCardinalSpline1D characteristics.
 *
 * @param publicAPI object on which methods will be bounds (public)
 * @param model object on which data structure will be bounds (protected)
 * @param {ICardinalSpline1DInitialValues} [initialValues] (default: {})
 */
export function extend(publicAPI: object, model: object, initialValues?: ICardinalSpline1DInitialValues): void;

/**
 * Method used to create a new instance of vtkCardinalSpline1D.
 * @param {ICardinalSpline1DInitialValues} [initialValues] for pre-setting some of its content
 */
export function newInstance(initialValues?: ICardinalSpline1DInitialValues): vtkCardinalSpline1D;

/**
 * vtkCardinalSpline1D provides methods for creating a 1D cubic spline object from given
 * parameters, and allows for the calculation of the spline value and derivative
 * at any given point inside the spline intervals.
 */
export declare const vtkCardinalSpline1D: {
	newInstance: typeof newInstance,
	extend: typeof extend
};
export default vtkCardinalSpline1D;
