import gl from '../webGL.js'
import * as webGL from '../webGL.js'

const ATTR_POSITION_LOC = 0;
const ATTR_NORM_LOC = 1;
const ATTR_UV_LOC = 2;

class VAO{
	constructor(name, vertices, indices = null, normals = null, uv = null){

		this.name = name;
		this.buffers = new Map();
		this.id = gl.createVertexArray();
		this.isIndexed = false;
		this.count = 0;

		gl.bindVertexArray(this.id);

		this.floatArrayBuffer("vert", vertices, ATTR_POSITION_LOC, 3,0,0);
		this.count = this.buffers.get("vert").count;

		if(indices) this.indexBuffer("index", indices);
		if(normals)	this.floatArrayBuffer("norm", normals, ATTR_NORM_LOC,3,0,0);
		if(uv)	this.floatArrayBuffer("uv", uv, ATTR_UV_LOC,2,0,0);

		gl.bindVertexArray(null);
		gl.bindBuffer(gl.ARRAY_BUFFER,null);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,null);
		webGL.env.vaos.set(name, this);

		return this;
	}


	floatArrayBuffer(name, array, attrLoc, size, stride = 0, offset = 0, isStatic = false, isInstance = false){

		let buffer = gl.createBuffer();
		array = (array instanceof Float32Array)? array : new Float32Array(array);

		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bufferData(gl.ARRAY_BUFFER, array, (isStatic !== false)? gl.STATIC_DRAW : gl.DYNAMIC_DRAW );
		gl.enableVertexAttribArray(attrLoc);
		gl.vertexAttribPointer(attrLoc, size, gl.FLOAT,false, stride, offset);

		if(isInstance === true) gl.vertexAttribDivisor(attrLoc, 1);

		this.buffers.set(name, {
			buffer: buffer,
			size:size,
			stride:stride,
			offset:offset,
			count:array.length / size
		});
	}


	indexBuffer(name, indices, isStatic = false){

		let buffer = gl.createBuffer();
		let array = (indices instanceof Uint16Array)? indices : new Uint16Array(indices);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, array, (isStatic !== false)? gl.STATIC_DRAW : gl.DYNAMIC_DRAW );

		this.buffers.set(name, {
			buffer:gl.createBuffer(), count:indices.length
		});

		this.isIndexed = true;
		this.count = indices.length;
	}
}

export default VAO
