# AGENTS.md for vixterra

## Purpose
The agentic coding assistant provides comprehensive support for developer queries specific to the "vixterra" project. This is achieved by synthesizing project requirements, technical architecture, and operational guidance to ensure accurate implementation of the 3D property visualization web application targeting San Diego, CA.

## Project Overview
The San Diego 3D Geospatial Visualizer is an interactive 3D web application designed for real estate and development visualization. The project creates an immersive experience by leveraging diverse geographic data sources and generative methods to fill data gaps. By focusing on a single, contained region like San Diego, CA, the project streamlines data acquisition, processing, and 3D rendering for efficient and performant operation.

### Deployment Architecture
The application will be deployed as a unified Laravel web application where:
- **Laravel Framework**: Serves as the primary web application framework, handling both backend logic and frontend delivery
- **Frontend Integration**: The Three.js-based frontend is integrated within Laravel's blade templates and asset pipeline
- **Address Processing**: Laravel acts as the input handler, receiving user addresses and coordinating all backend processing
- **Data Flow**: Laravel processes addresses through geocoding, data acquisition, and 3D model generation, then sends structured data to the integrated Three.js frontend for rendering

## Scope & Limitations

### Project Scope
- Frontend development using vanilla Three.js within Laravel's frontend architecture
- 3D scene construction, materials, textures, and lighting implementation
- User interaction via OrbitControls for intuitive camera navigation
- Integration with Laravel backend through internal APIs and data structures
- Support for multiple 3D model formats: glTF (preferred), OBJ, STL
- Physically Based Rendering (PBR) materials and advanced texture mapping
- Responsive design across different device sizes and screen resolutions
- Interactive 3D visualization of San Diego geospatial data

### Technical Constraints
- **No browser storage APIs**: localStorage and sessionStorage are not supported in artifact environments
- **No framework dependencies**: Must use vanilla JavaScript, HTML, and CSS - no React, Vue, Angular, or other JavaScript frameworks
- **Backend operations**: Agentic coding systems will not execute php artisan commands, Composer operations, or Laravel-specific build processes
- **Data format considerations**: GeoJSON has "terrible performance for large amounts of data" requiring optimization techniques like simplification or vector tiles

### Operational Limitations
- Does not fabricate information beyond documented project specifications
- Limited to explicitly defined tools, APIs, and data sources from project documentation
- Cannot perform actions outside predefined project scope
- Backend environment management and Laravel deployment handled by separate development processes

## Technology Stack & Detailed Architecture

### Core Technology Stack
The MVP utilizes a robust, open-source technology stack focusing on efficiency and direct control over web functionalities:

#### Backend (Laravel Framework)
- **Laravel**: Manages server-side logic including address input handling, geocoding operations, and geospatial data acquisition
- **PostgreSQL/PostGIS**: Database schema for storing virtual 3D city models based on CityGML standard
- **3D City Database V5**: Supports CityGML versions 1.0, 2.0, and 3.0 for managing 3D urban objects

#### Frontend (Vanilla Three.js)
- **Vanilla Three.js**: Direct WebGL rendering within the web browser with full control over WebGL functionalities
- **HTML, CSS, JavaScript**: Core building blocks for client-side application supporting Three.js implementation
- **OrbitControls**: Three.js add-on for intuitive user interaction enabling rotation, zooming, and panning

### Data Sources & Integration
The application draws upon various geospatial data sources and employs generative techniques:

#### Primary Data Sources
1. **OpenStreetMap (OSM)**
   - Building footprints (2D polygons) extracted for 3D model generation
   - Street network data for 3D street, sidewalk, and intersection representation
   - Community-driven, open-source geographic database

2. **Digital Elevation Models (DEMs) / Heightmaps**
   - RGB-encoded DEMs for realistic terrain generation
   - Heightmaps applied as displacement maps to deform terrain surfaces
   - Essential for creating realistic topographical representation

3. **3D City Database (CityGML)**
   - Semantically rich urban objects at different Levels of Detail (LODs)
   - Appearance information including textures and materials
   - Digital Terrain Models (DTMs) integration
   - Built on PostgreSQL/PostGIS schema

4. **Lidar Point Cloud Data**
   - Highly detailed modeling of vegetation elements, particularly trees
   - Available for specific regions within San Diego area
   - Provides precise geometric data for complex natural features

5. **Geocoding Services**
   - OpenStreetMap's Nominatim as primary geocoding service
   - Google Maps APIs as alternative geocoding option
   - Converts user addresses to precise geographic coordinates

#### Generative Methods & Data Gap Filling
- **Building Generation**: OSM footprints extruded into 3D models with randomly generated heights (10-50 meters) when data missing
- **Complex Roof Shapes**: Advanced algorithms like "straight skeleton" for sophisticated building geometries
- **Terrain Simulation**: Heightmaps applied to plane geometry for realistic surface deformation
- **Procedural Vegetation**: Trees, fences, and landscaping elements procedurally generated or represented by generic 3D models
- **Texture Generation**: PBR materials with normal maps and displacement maps for enhanced realism

## Detailed Frontend Architecture & Implementation

### Three.js Scene Construction
The frontend creates a comprehensive 3D environment through systematic scene assembly:

#### Core Three.js Components
```javascript
// Essential Three.js scene setup
const scene = new THREE.Scene();           // Container for all 3D objects
const camera = new THREE.PerspectiveCamera(); // Human-like vision simulation
const renderer = new THREE.WebGLRenderer();   // WebGL rendering to HTML canvas
```

#### Scene Initialization Requirements
1. **Scene (THREE.Scene)**: Acts as container for all 3D objects, lights, and cameras
2. **Camera Configuration**:
   - **THREE.PerspectiveCamera**: Simulates human vision with objects appearing smaller as they recede
   - **Field of View (FOV)**: Defines extent of scene visible to camera
   - **Aspect Ratio**: Calculated dynamically using `window.innerWidth / window.innerHeight`
   - **Near/Far Clipping Planes**: Define closest and farthest rendering points
3. **Renderer (THREE.WebGLRenderer)**: 
   - Renders scene onto HTML canvas element using WebGL
   - Size dynamically adjusted to `window.innerWidth` and `window.innerHeight`
   - Ensures full-screen responsive experience across device sizes

### Building and Terrain Generation Systems

#### Building Model Generation
The system transforms 2D geospatial data into detailed 3D building models:

1. **OSM Footprint Processing**:
   - 2D building footprints (polygons) extracted from OpenStreetMap data
   - Polygons serve as base for 3D building model generation
   - Geometric validation ensures proper polygon structure

2. **3D Extrusion Process**:
   - Footprints extruded vertically to create building volumes
   - Height information randomly generated (10-50 meters) when missing from OSM
   - THREE.Mesh objects created using THREE.ExtrudeGeometry or custom BufferGeometry

3. **Advanced Roof Generation**:
   - Complex roof shapes (hipped, gabled) require advanced algorithms
   - "Straight skeleton" algorithm implementation for sophisticated geometries
   - Integration with external tools for complex architectural features

#### Terrain Simulation Implementation
Realistic terrain created through heightmap-based surface modification:

1. **Digital Elevation Model Processing**:
   - RGB-encoded DEMs provide elevation data across San Diego region
   - Heightmap images processed into displacement data

2. **Three.js Terrain Creation**:
   - Simple THREE.PlaneGeometry serves as base terrain mesh
   - Heightmap applied as displacement map to material
   - Displacement literally modifies geometry surface topology
   - Creates real depth and bumps based on grayscale image values

3. **Terrain Material Configuration**:
   ```javascript
   const terrainMaterial = new THREE.MeshStandardMaterial({
       map: terrainTexture,              // Surface appearance
       displacementMap: heightmapTexture, // Actual geometry modification
       displacementScale: elevationScale  // Controls displacement intensity
   });
   ```

### Advanced Materials and Texturing Systems

#### Physically Based Rendering (PBR) Implementation
The visualizer utilizes advanced PBR materials for realistic light interaction:

1. **PBR Material Types**:
   - **THREE.MeshStandardMaterial**: Standard PBR workflow with realistic light response
   - **THREE.MeshPhysicalMaterial**: Advanced PBR with additional properties
   - **Roughness and Metalness**: Define surface reflection and scattering properties

2. **Texture Mapping Systems**:
   - **UV Mapping**: Essential for accurately mapping 2D textures onto 3D geometry
   - **THREE.TextureLoader**: Loads image assets for texture application
   - **Multiple UV Sets**: Support for different texture coordinate systems

3. **Advanced Texture Types**:
   - **Normal Maps**: Fake intricate surface details without increasing geometry complexity
   - **Displacement Maps**: Actually modify geometry surface topology for real depth
   - **Ambient Occlusion (AO) Maps**: Add subtle shadows where light is blocked
   - **Roughness/Metalness Maps**: Control surface material properties
   - **Environment Maps**: Provide realistic reflections and global illumination

#### Texture Application Patterns
```javascript
// Comprehensive material setup
const buildingMaterial = new THREE.MeshStandardMaterial({
    map: diffuseTexture,           // Base color/albedo
    normalMap: normalTexture,      // Surface detail simulation
    roughnessMap: roughnessTexture, // Surface roughness variation
    metalnessMap: metalnessTexture, // Metallic property variation
    aoMap: aoTexture,              // Ambient occlusion shadows
    envMap: environmentTexture      // Environmental reflections
});

// UV2 coordinates for AO maps
geometry.attributes.uv2 = geometry.attributes.uv;
```

### Comprehensive Lighting System

#### Multi-Type Lighting Implementation
Proper lighting crucial for depth perception and visual realism:

1. **Ambient Lighting**:
   - **THREE.AmbientLight**: Uniform scene illumination preventing completely black areas
   - **THREE.HemisphereLight**: Natural lighting from sky and ground simulation

2. **Directional Lighting**:
   - **THREE.DirectionalLight**: Simulates distant light sources like the sun
   - Casts parallel rays enabling realistic shadow generation
   - Shadow mapping configuration for realistic shadow rendering

3. **Point and Spot Lighting**:
   - **THREE.PointLight**: Omnidirectional light emission from single point
   - **THREE.SpotLight**: Cone-shaped light projection for focused illumination
   - Distance attenuation and intensity controls

4. **Shadow System Configuration**:
   ```javascript
   // Enable shadows in renderer
   renderer.shadowMap.enabled = true;
   renderer.shadowMap.type = THREE.PCFSoftShadowMap;
   
   // Configure light shadows
   directionalLight.castShadow = true;
   directionalLight.shadow.mapSize.width = 2048;
   directionalLight.shadow.mapSize.height = 2048;
   ```

### User Interaction and Control Systems

#### OrbitControls Integration
Intuitive camera navigation enabling comprehensive scene exploration:

1. **Control Configuration**:
   ```javascript
   const controls = new THREE.OrbitControls(camera, renderer.domElement);
   controls.enableDamping = true;        // Smooth movement
   controls.dampingFactor = 0.1;         // Damping intensity
   controls.enableZoom = true;           // Zoom functionality
   controls.enableRotate = true;         // Rotation controls
   controls.enablePan = true;            // Panning capability
   ```

2. **Responsive Interaction**:
   - Mouse wheel zoom control
   - Click and drag rotation
   - Right-click pan functionality
   - Touch gesture support for mobile devices

3. **Movement Constraints**:
   - Minimum and maximum zoom distances
   - Polar angle limits for vertical rotation
   - Azimuth angle constraints for horizontal rotation

#### Responsive Design Implementation
Dynamic adaptation to different screen sizes and orientations:

1. **Viewport Responsiveness**:
   ```javascript
   function onWindowResize() {
       camera.aspect = window.innerWidth / window.innerHeight;
       camera.updateProjectionMatrix();
       renderer.setSize(window.innerWidth, window.innerHeight);
   }
   window.addEventListener('resize', onWindowResize);
   ```

2. **Device-Specific Optimizations**:
   - Mobile device touch event handling
   - Tablet gesture recognition
   - Desktop mouse and keyboard interaction
   - High-DPI display support

### Animation and Rendering Loop

#### Continuous Rendering System
Smooth animation and interactive response through optimized rendering loop:

1. **Animation Loop Structure**:
   ```javascript
   function animate() {
       requestAnimationFrame(animate);  // Browser-optimized frame timing
       controls.update();               // Update camera controls
       updateAnimations();              // Custom animation updates
       renderer.render(scene, camera);  // Render frame
   }
   ```

2. **Performance Optimization**:
   - **Frustum Culling**: Only render objects within camera view
   - **Level of Detail (LOD)**: Reduce complexity for distant objects
   - **Instancing**: Efficient rendering of repeated geometries
   - **Texture Atlasing**: Combine multiple textures for reduced draw calls

## Data Flow and Backend Integration

### Laravel Backend Responsibilities
The Laravel backend serves as the central hub for all geospatial data operations:

#### Geocoding Operations
1. **Address Processing**:
   - Receive user address input from frontend interface
   - Validate and sanitize address data
   - Route to appropriate geocoding service

2. **Coordinate Conversion**:
   - Utilize OpenStreetMap's Nominatim for primary geocoding
   - Google Maps APIs as fallback geocoding option
   - Return precise latitude and longitude coordinates

#### Data Acquisition and Processing
1. **OpenStreetMap Data Retrieval**:
   - Extract building footprints for specified San Diego area
   - Retrieve street network data including roads and intersections
   - Process OSM data for 3D model generation compatibility

2. **Elevation Data Processing**:
   - Obtain Digital Elevation Models for terrain generation
   - Process heightmap data for Three.js displacement mapping
   - Optimize elevation data for frontend performance

3. **3D City Database Integration**:
   - Query 3D City Database V5 for existing CityGML models
   - Extract various Levels of Detail (LODs) urban objects
   - Process appearance information including textures and materials
   - Integrate Digital Terrain Models (DTMs)

4. **Lidar Data Integration**:
   - Incorporate Lidar point cloud data when available
   - Process point clouds for vegetation modeling
   - Convert Lidar data to Three.js-compatible formats

#### Generative Data Creation
1. **Building Model Generation**:
   - Extrude OSM footprints into 3D building models
   - Generate random heights (10-50 meters) for missing height data
   - Apply advanced algorithms for complex roof shapes
   - Create optimized geometries for web rendering

2. **Procedural Element Generation**:
   - Generate vegetation based on typical urban layouts
   - Create fence and landscaping elements at inferred locations
   - Produce generic 3D models for missing specific data

3. **Texture and Material Preparation**:
   - Process image assets for PBR texture application
   - Generate normal maps and displacement maps
   - Prepare environment maps for realistic reflections
   - Optimize textures for web delivery

#### Data Output and Formatting
1. **3D Model Format Preparation**:
   - **glTF Output**: Primary format for efficient runtime delivery
   - **OBJ Export**: Widely compatible format with MTL material files
   - **STL Generation**: Separate downloadable files for buildings, terrain, roads

2. **GeoJSON Processing**:
   - Structure processed geospatial data into GeoJSON format
   - Implement optimization for large datasets
   - Apply simplification techniques for performance
   - Convert to vector tiles for complex datasets

3. **API Endpoint Structure**:
   - RESTful endpoints for different data types
   - Efficient data transfer protocols
   - Caching strategies for repeated requests
   - Error handling and fallback mechanisms

### Frontend Data Consumption
The Three.js frontend receives and processes data from Laravel backend:

#### Model Loading and Integration
1. **glTF Model Loading**:
   ```javascript
   const loader = new THREE.GLTFLoader();
   loader.load('models/buildings.glb', (gltf) => {
       scene.add(gltf.scene);
       setupMaterials(gltf.scene);
   });
   ```

2. **OBJ Model Processing**:
   ```javascript
   const objLoader = new THREE.OBJLoader();
   const mtlLoader = new THREE.MTLLoader();
   
   mtlLoader.load('materials.mtl', (materials) => {
       materials.preload();
       objLoader.setMaterials(materials);
       objLoader.load('model.obj', (object) => {
           scene.add(object);
       });
   });
   ```

3. **STL Model Handling**:
   ```javascript
   const stlLoader = new THREE.STLLoader();
   stlLoader.load('terrain.stl', (geometry) => {
       const material = new THREE.MeshStandardMaterial();
       const mesh = new THREE.Mesh(geometry, material);
       scene.add(mesh);
   });
   ```

#### Dynamic Scene Construction
1. **Geometric Processing**:
   - Convert backend geometries to Three.js BufferGeometry
   - Apply transformations for proper world positioning
   - Optimize geometry for rendering performance

2. **Material Assignment**:
   - Apply PBR materials based on backend specifications
   - Load and assign textures from backend-prepared assets
   - Configure material properties for realistic appearance

3. **Positioning and Scaling**:
   - Transform geographic coordinates to Three.js world space
   - Apply appropriate scaling for scene coherence
   - Implement proper object hierarchies for complex models

## 3D Model Formats and Processing

### Supported Model Formats
The visualizer supports multiple 3D model formats optimized for different use cases:

#### glTF (GL Transmission Format) - Primary Format
1. **Format Advantages**:
   - Recommended by Three.js for runtime asset delivery
   - Compact transmission and fast loading capabilities
   - Comprehensive scene description including meshes, materials, textures
   - Support for animations, lights, cameras, and skinned models

2. **glTF Variants**:
   - **.glb (Binary)**: Single binary file containing all assets
   - **.gltf (JSON)**: Text-based format with separate binary and image files
   - **DRACO Compression**: Additional compression for geometry optimization

3. **glTF Processing Pipeline**:
   ```javascript
   const loader = new THREE.GLTFLoader();
   const dracoLoader = new THREE.DRACOLoader();
   dracoLoader.setDecoderPath('/draco/');
   loader.setDRACOLoader(dracoLoader);
   
   loader.load('scene.glb', (gltf) => {
       gltf.scene.traverse((child) => {
           if (child.isMesh) {
               child.castShadow = true;
               child.receiveShadow = true;
           }
       });
       scene.add(gltf.scene);
   });
   ```

#### OBJ (Wavefront OBJ) Format
1. **Format Characteristics**:
   - Widely supported across 3D software
   - Text-based geometry description
   - Associated MTL files for material information
   - Good for simple geometric models

2. **OBJ Material Integration**:
   ```javascript
   const mtlLoader = new THREE.MTLLoader();
   mtlLoader.load('model.mtl', (materials) => {
       materials.preload();
       
       const objLoader = new THREE.OBJLoader();
       objLoader.setMaterials(materials);
       objLoader.load('model.obj', (object) => {
           object.traverse((child) => {
               if (child.isMesh) {
                   // Apply PBR enhancements
                   enhanceMaterialWithPBR(child.material);
               }
           });
           scene.add(object);
       });
   });
   ```

#### STL (Stereolithography) Format
1. **Format Applications**:
   - Surface geometry description without color/texture
   - Useful for downloadable building, terrain, and road models
   - Suitable for 3D printing applications
   - Programmatic texture application post-loading

2. **STL Enhancement Pipeline**:
   ```javascript
   const stlLoader = new THREE.STLLoader();
   stlLoader.load('building.stl', (geometry) => {
       // Generate UV coordinates for texturing
       geometry.computeVertexNormals();
       geometry.computeBoundingBox();
       
       // Apply procedural UV mapping
       generateUVCoordinates(geometry);
       
       // Create enhanced material
       const material = new THREE.MeshStandardMaterial({
           color: 0x888888,
           roughness: 0.7,
           metalness: 0.1
       });
       
       const mesh = new THREE.Mesh(geometry, material);
       scene.add(mesh);
   });
   ```

### Model Optimization and Performance

#### Geometry Optimization
1. **DRACO Compression**:
   - Significant geometry size reduction
   - Maintained visual quality
   - Faster download and parsing times
   - Browser-based decompression

2. **Level of Detail (LOD) Systems**:
   ```javascript
   const lod = new THREE.LOD();
   lod.addLevel(highDetailMesh, 0);    // Close viewing
   lod.addLevel(mediumDetailMesh, 50); // Medium distance
   lod.addLevel(lowDetailMesh, 200);   // Far viewing
   scene.add(lod);
   ```

3. **Instanced Rendering**:
   ```javascript
   // Efficient rendering of repeated elements (trees, buildings)
   const instancedMesh = new THREE.InstancedMesh(
       treeGeometry,
       treeMaterial,
       treeCount
   );
   
   // Position instances based on data
   positions.forEach((position, index) => {
       const matrix = new THREE.Matrix4();
       matrix.setPosition(position.x, position.y, position.z);
       instancedMesh.setMatrixAt(index, matrix);
   });
   ```

## Performance Optimization Strategies

### Rendering Performance
1. **Frustum Culling**: Automatic culling of objects outside camera view
2. **Occlusion Culling**: Advanced culling of objects blocked by other objects
3. **Texture Optimization**: Appropriate resolution selection based on viewing distance
4. **Shader Optimization**: Efficient material shaders for complex scenes

### Memory Management
1. **Geometry Disposal**: Proper cleanup of unused geometries
2. **Texture Management**: Efficient texture loading and unloading
3. **Model Streaming**: Dynamic loading of detailed models based on camera position

### Data Transfer Optimization
1. **Transferable Objects**: Zero-copy data transfer between web workers and main thread
2. **Progressive Loading**: Incremental scene loading for better user experience
3. **Caching Strategies**: Client-side caching of frequently accessed models

## Error Handling and Fallback Mechanisms

### Model Loading Error Handling
```javascript
function loadModelWithFallback(url, fallbackGeometry, fallbackMaterial) {
    const loader = new THREE.GLTFLoader();
    
    return new Promise((resolve, reject) => {
        loader.load(
            url,
            (gltf) => resolve(gltf.scene),
            (progress) => console.log('Loading progress:', progress),
            (error) => {
                console.warn('Model loading failed, using fallback:', error);
                const fallbackMesh = new THREE.Mesh(fallbackGeometry, fallbackMaterial);
                resolve(fallbackMesh);
            }
        );
    });
}
```

### Texture Loading Fallbacks
```javascript
function loadTextureWithFallback(url, fallbackColor = 0x888888) {
    const loader = new THREE.TextureLoader();
    const fallbackTexture = new THREE.DataTexture(
        new Uint8Array([128, 128, 128, 255]), 1, 1, THREE.RGBAFormat
    );
    
    return new Promise((resolve) => {
        loader.load(
            url,
            (texture) => resolve(texture),
            undefined,
            (error) => {
                console.warn('Texture loading failed, using fallback:', error);
                resolve(fallbackTexture);
            }
        );
    });
}
```

### WebGL Context Loss Recovery
```javascript
function handleContextLoss() {
    renderer.domElement.addEventListener('webglcontextlost', (event) => {
        event.preventDefault();
        console.warn('WebGL context lost');
    });
    
    renderer.domElement.addEventListener('webglcontextrestored', () => {
        console.log('WebGL context restored');
        // Reinitialize scene, reload textures, etc.
        reinitializeScene();
    });
}
```

## Reasoning, Planning & Workflow

### Pre-Action Checklist Template
Before implementing any feature, create a comprehensive 5-7 bullet checklist:
- Analyze user requirements against project documentation and technical constraints
- Identify required Three.js components, data dependencies, and backend integration points
- Plan scene structure, rendering pipeline, and performance optimization strategies
- Consider material systems, lighting requirements, and user interaction patterns
- Map data flow from Laravel backend through frontend rendering pipeline
- Validate approach against vanilla JavaScript constraint and no-framework requirement
- Define comprehensive success criteria, testing approach, and fallback mechanisms

### Implementation Workflow
1. **Analysis Phase**: 
   - Examine query against comprehensive project documentation
   - Identify technical constraints and architectural requirements
   - Map required data sources and backend integration points

2. **Planning Phase**: 
   - Create detailed conceptual checklist identifying all implementation steps
   - Document assumptions about data formats and backend API structure
   - Plan Three.js scene hierarchy and component relationships

3. **Tool Preparation**: 
   - State purpose and expected inputs before Three.js API calls
   - Document expected data formats and backend response structures
   - Prepare error handling and fallback mechanisms

4. **Implementation**: 
   - Execute planned steps with comprehensive intermediate validation
   - Test Three.js components individually before integration
   - Validate data flow from backend through rendering pipeline

5. **Validation Phase**: 
   - Verify results against project standards and performance requirements
   - Test responsive behavior across different viewport sizes
   - Confirm material and lighting systems work correctly

6. **Reflection**: 
   - Confirm complete query resolution before concluding
   - Document any deviations from original plan
   - Identify potential optimization opportunities

### Validation Protocol
After each significant implementation step:
- **Rendering Validation**: Verify Three.js scene renders without WebGL errors
- **Performance Check**: Confirm frame rate maintains acceptable levels (>30 FPS)
- **Responsive Behavior**: Test viewport resizing and camera control responsiveness  
- **Material Validation**: Check texture loading and PBR material application
- **Integration Testing**: Verify backend data consumption and processing
- **Memory Usage**: Monitor for memory leaks or excessive resource consumption
- **Cross-Device Testing**: Validate functionality across different devices and browsers

## Project-Specific Implementation Guidelines

### Three.js Scene Setup Patterns
```javascript
// Comprehensive scene initialization
function initializeScene() {
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB); // Sky blue background
    
    // Camera configuration
    const camera = new THREE.PerspectiveCamera(
        75,                                    // Field of view
        window.innerWidth / window.innerHeight, // Aspect ratio
        0.1,                                   // Near clipping plane
        10000                                  // Far clipping plane
    );
    camera.position.set(100, 100, 100);
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    
    // Controls setup
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.minDistance = 10;
    controls.maxDistance = 1000;
    controls.maxPolarAngle = Math.PI / 2; // Prevent going below ground
    
    return { scene, camera, renderer, controls };
}
```

### Data Processing Patterns
```javascript
// Process building data from Laravel backend
function processBuildingData(buildingData) {
    const buildings = [];
    
    buildingData.forEach(building => {
        // Extract footprint coordinates
        const footprint = building.footprint.coordinates[0];
        
        // Create shape from footprint
        const shape = new THREE.Shape();
        footprint.forEach((coord, index) => {
            const [x, z] = convertGeoToScene(coord[0], coord[1]);
            if (index === 0) {
                shape.moveTo(x, z);
            } else {
                shape.lineTo(x, z);
            }
        });
        
        // Extrude building
        const height = building.height || (Math.random() * 40 + 10);
        const extrudeSettings = {
            depth: height,
            bevelEnabled: false
        };
        
        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        geometry.rotateX(-Math.PI / 2); // Align with ground plane
        
        // Apply materials
        const material = new THREE.MeshStandardMaterial({
            color: building.color || 0x888888,
            roughness: 0.7,
            metalness: 0.1
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.y = 0;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        
        buildings.push(mesh);
    });
    
    return buildings;
}

// Geographic coordinate conversion
function convertGeoToScene(longitude, latitude) {
    // Convert lat/lon to scene coordinates
    // This would use the specific projection for San Diego area
    const sceneX = (longitude - centerLongitude) * scaleX;
    const sceneZ = (latitude - centerLatitude) * scaleZ;
    return [sceneX, sceneZ];
}
```

### Material and Texture Management
```javascript
// Comprehensive material system
class MaterialManager {
    constructor() {
        this.textureLoader = new THREE.TextureLoader();
        this.materials = new Map();
        this.textures = new Map();
    }
    
    async loadTexture(url, options = {}) {
        if (this.textures.has(url)) {
            return this.textures.get(url);
        }
        
        try {
            const texture = await new Promise((resolve, reject) => {
                this.textureLoader.load(url, resolve, undefined, reject);
            });
            
            // Configure texture
            texture.wrapS = options.wrapS || THREE.RepeatWrapping;
            texture.wrapT = options.wrapT || THREE.RepeatWrapping;
            texture.repeat.set(options.repeatX || 1, options.repeatY || 1);
            texture.encoding = options.encoding || THREE.sRGBEncoding;
            
            this.textures.set(url, texture);
            return texture;
        } catch (error) {
            console.warn(`Failed to load texture ${url}:`, error);
            return this.createFallbackTexture();
        }
    }
    
    createFallbackTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = 64;
        const context = canvas.getContext('2d');
        context.fillStyle = '#888888';
        context.fillRect(0, 0, 64, 64);
        
        const texture = new THREE.CanvasTexture(canvas);
        return texture;
    }
    
    async createPBRMaterial(config) {
        const material = new THREE.MeshStandardMaterial();
        
        if (config.diffuse) {
            material.map = await this.loadTexture(config.diffuse);
        }
        
        if (config.normal) {
            material.normalMap = await this.loadTexture(config.normal);
            material.normalScale.set(config.normalScale || 1, config.normalScale || 1);
        }
        
        if (config.roughness) {
            material.roughnessMap = await this.loadTexture(config.roughness);
        } else {
            material.roughness = config.roughnessValue || 0.7;
        }
        
        if (config.metalness) {
            material.metalnessMap = await this.loadTexture(config.metalness);
        } else {
            material.metalness = config.metalnessValue || 0.1;
        }
        
        if (config.ao) {
            material.aoMap = await this.loadTexture(config.ao);
            material.aoMapIntensity = config.aoIntensity || 1.0;
        }
        
        if (config.displacement) {
            material.displacementMap = await this.loadTexture(config.displacement);
            material.displacementScale = config.displacementScale || 1.0;
        }
        
        return material;
    }
    
    dispose() {
        this.textures.forEach(texture => texture.dispose());
        this.materials.forEach(material => material.dispose());
        this.textures.clear();
        this.materials.clear();
    }
}
```

### Lighting System Implementation
```javascript
// Comprehensive lighting setup for San Diego visualization
function setupLighting(scene) {
    // Ambient light for overall scene illumination
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    scene.add(ambientLight);
    
    // Hemisphere light for natural sky/ground lighting
    const hemisphereLight = new THREE.HemisphereLight(0x87CEEB, 0x8B4513, 0.4);
    hemisphereLight.position.set(0, 100, 0);
    scene.add(hemisphereLight);
    
    // Directional light (sun) for main illumination and shadows
    const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.8);
    directionalLight.position.set(100, 200, 50);
    directionalLight.target.position.set(0, 0, 0);
    directionalLight.castShadow = true;
    
    // Configure shadow properties
    directionalLight.shadow.mapSize.width = 4096;
    directionalLight.shadow.mapSize.height = 4096;
    directionalLight.shadow.camera.near = 1;
    directionalLight.shadow.camera.far = 1000;
    directionalLight.shadow.camera.left = -500;
    directionalLight.shadow.camera.right = 500;
    directionalLight.shadow.camera.top = 500;
    directionalLight.shadow.camera.bottom = -500;
    directionalLight.shadow.bias = -0.0001;
    
    scene.add(directionalLight);
    scene.add(directionalLight.target);
    
    // Point lights for specific area illumination
    const pointLight = new THREE.PointLight(0xFFFFAA, 0.5, 100);
    pointLight.position.set(50, 30, 50);
    pointLight.castShadow = true;
    scene.add(pointLight);
    
    return {
        ambientLight,
        hemisphereLight,
        directionalLight,
        pointLight
    };
}
```

### Terrain Generation System
```javascript
// Advanced terrain generation from heightmap data
class TerrainGenerator {
    constructor(width = 512, height = 512, segments = 255) {
        this.width = width;
        this.height = height;
        this.segments = segments;
        this.materialManager = new MaterialManager();
    }
    
    async createTerrain(heightmapUrl, textureConfig = {}) {
        // Create base plane geometry
        const geometry = new THREE.PlaneGeometry(
            this.width, 
            this.height, 
            this.segments, 
            this.segments
        );
        
        // Load heightmap for displacement
        const heightmapTexture = await this.materialManager.loadTexture(heightmapUrl);
        
        // Create terrain material with PBR properties
        const material = await this.materialManager.createPBRMaterial({
            diffuse: textureConfig.diffuse || null,
            normal: textureConfig.normal || null,
            roughness: textureConfig.roughness || null,
            roughnessValue: textureConfig.roughnessValue || 0.8,
            ao: textureConfig.ao || null,
            displacement: heightmapUrl,
            displacementScale: textureConfig.elevationScale || 50
        });
        
        // Configure texture repeating for large terrain
        if (material.map) {
            material.map.wrapS = material.map.wrapT = THREE.RepeatWrapping;
            material.map.repeat.set(
                textureConfig.repeatX || 10, 
                textureConfig.repeatY || 10
            );
        }
        
        // Create terrain mesh
        const terrain = new THREE.Mesh(geometry, material);
        terrain.rotation.x = -Math.PI / 2; // Horizontal orientation
        terrain.receiveShadow = true;
        terrain.position.y = 0;
        
        return terrain;
    }
    
    // Generate procedural terrain using noise functions
    generateProceduralTerrain(noiseConfig = {}) {
        const geometry = new THREE.PlaneGeometry(
            this.width, 
            this.height, 
            this.segments, 
            this.segments
        );
        
        const vertices = geometry.attributes.position.array;
        
        // Apply noise-based height variation
        for (let i = 0; i < vertices.length; i += 3) {
            const x = vertices[i];
            const z = vertices[i + 1];
            
            // Simple Perlin-like noise (in production, use proper noise library)
            const elevation = this.simpleNoise(
                x / noiseConfig.scale || 50, 
                z / noiseConfig.scale || 50
            ) * (noiseConfig.amplitude || 20);
            
            vertices[i + 2] = elevation; // Y coordinate (height)
        }
        
        geometry.attributes.position.needsUpdate = true;
        geometry.computeVertexNormals();
        
        const material = new THREE.MeshStandardMaterial({
            color: 0x4a7c59,
            roughness: 0.8,
            metalness: 0.1
        });
        
        const terrain = new THREE.Mesh(geometry, material);
        terrain.rotation.x = -Math.PI / 2;
        terrain.receiveShadow = true;
        
        return terrain;
    }
    
    // Simple noise function (replace with proper noise library in production)
    simpleNoise(x, z) {
        return Math.sin(x * 0.1) * Math.cos(z * 0.1) + 
               Math.sin(x * 0.05) * Math.cos(z * 0.05) * 0.5;
    }
}
```

### Vegetation and Environmental Features
```javascript
// Procedural vegetation generation system
class VegetationGenerator {
    constructor() {
        this.materialManager = new MaterialManager();
        this.treeGeometries = [];
        this.treeMaterials = [];
        this.initialized = false;
    }
    
    async initialize() {
        if (this.initialized) return;
        
        // Create basic tree geometries
        await this.createTreeGeometries();
        await this.createTreeMaterials();
        
        this.initialized = true;
    }
    
    async createTreeGeometries() {
        // Simple tree trunk
        const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.8, 8, 8);
        
        // Tree canopy variations
        const canopyGeometry1 = new THREE.SphereGeometry(4, 8, 6);
        const canopyGeometry2 = new THREE.ConeGeometry(4, 8, 8);
        const canopyGeometry3 = new THREE.DodecahedronGeometry(3.5);
        
        this.treeGeometries.push({
            trunk: trunkGeometry,
            canopies: [canopyGeometry1, canopyGeometry2, canopyGeometry3]
        });
    }
    
    async createTreeMaterials() {
        // Trunk material
        const trunkMaterial = await this.materialManager.createPBRMaterial({
            diffuse: 'textures/bark_diffuse.jpg',
            normal: 'textures/bark_normal.jpg',
            roughnessValue: 0.9,
            metalnessValue: 0.0
        });
        
        // Canopy materials with seasonal variations
        const canopyMaterials = [
            new THREE.MeshStandardMaterial({ color: 0x228B22, roughness: 0.8 }), // Green
            new THREE.MeshStandardMaterial({ color: 0xDEB887, roughness: 0.8 }), // Autumn
            new THREE.MeshStandardMaterial({ color: 0x006400, roughness: 0.8 })  // Dark green
        ];
        
        this.treeMaterials = {
            trunk: trunkMaterial,
            canopies: canopyMaterials
        };
    }
    
    generateTreesFromData(treePositions, terrainMesh) {
        const trees = new THREE.Group();
        
        treePositions.forEach(position => {
            const tree = this.createSingleTree(position, terrainMesh);
            if (tree) trees.add(tree);
        });
        
        return trees;
    }
    
    createSingleTree(position, terrainMesh) {
        if (!this.initialized) {
            console.warn('VegetationGenerator not initialized');
            return null;
        }
        
        const tree = new THREE.Group();
        
        // Get terrain height at tree position
        const terrainHeight = this.getTerrainHeightAt(position.x, position.z, terrainMesh);
        
        // Create trunk
        const trunkGeometry = this.treeGeometries[0].trunk.clone();
        const trunk = new THREE.Mesh(trunkGeometry, this.treeMaterials.trunk);
        trunk.position.y = terrainHeight + 4; // Half trunk height
        trunk.castShadow = true;
        trunk.receiveShadow = true;
        tree.add(trunk);
        
        // Create canopy
        const canopyIndex = Math.floor(Math.random() * this.treeGeometries[0].canopies.length);
        const materialIndex = Math.floor(Math.random() * this.treeMaterials.canopies.length);
        
        const canopyGeometry = this.treeGeometries[0].canopies[canopyIndex].clone();
        const canopy = new THREE.Mesh(
            canopyGeometry, 
            this.treeMaterials.canopies[materialIndex]
        );
        canopy.position.y = terrainHeight + 10; // Above trunk
        canopy.castShadow = true;
        canopy.receiveShadow = true;
        tree.add(canopy);
        
        // Position tree
        tree.position.set(position.x, 0, position.z);
        
        // Add slight random rotation and scale variation
        tree.rotation.y = Math.random() * Math.PI * 2;
        const scale = 0.8 + Math.random() * 0.4; // 0.8 to 1.2 scale
        tree.scale.setScalar(scale);
        
        return tree;
    }
    
    getTerrainHeightAt(x, z, terrainMesh) {
        // Raycast to find terrain height at specific position
        const raycaster = new THREE.Raycaster();
        raycaster.set(
            new THREE.Vector3(x, 100, z), 
            new THREE.Vector3(0, -1, 0)
        );
        
        const intersections = raycaster.intersectObject(terrainMesh);
        return intersections.length > 0 ? intersections[0].point.y : 0;
    }
    
    // Generate procedural tree positions based on terrain and urban layout
    generateTreePositions(bounds, density = 0.1, exclusionZones = []) {
        const positions = [];
        const gridSize = Math.sqrt(1 / density);
        
        for (let x = bounds.minX; x < bounds.maxX; x += gridSize) {
            for (let z = bounds.minZ; z < bounds.maxZ; z += gridSize) {
                // Add some randomness to grid positions
                const jitterX = (Math.random() - 0.5) * gridSize * 0.5;
                const jitterZ = (Math.random() - 0.5) * gridSize * 0.5;
                
                const position = {
                    x: x + jitterX,
                    z: z + jitterZ
                };
                
                // Check if position is in exclusion zones (buildings, roads)
                if (!this.isInExclusionZone(position, exclusionZones)) {
                    positions.push(position);
                }
            }
        }
        
        return positions;
    }
    
    isInExclusionZone(position, exclusionZones) {
        return exclusionZones.some(zone => {
            return position.x >= zone.minX && position.x <= zone.maxX &&
                   position.z >= zone.minZ && position.z <= zone.maxZ;
        });
    }
}
```

## Advanced Data Integration and Processing

### GeoJSON Processing and Optimization
```javascript
// Efficient GeoJSON processing for large San Diego datasets
class GeoJSONProcessor {
    constructor() {
        this.simplificationTolerance = 0.001; // Coordinate simplification tolerance
        this.maxFeatures = 10000; // Maximum features to process at once
    }
    
    processLargeGeoJSON(geoJsonData) {
        console.log(`Processing GeoJSON with ${geoJsonData.features.length} features`);
        
        // Chunk processing for large datasets
        const chunks = this.chunkFeatures(geoJsonData.features, 1000);
        const processedChunks = [];
        
        chunks.forEach((chunk, index) => {
            console.log(`Processing chunk ${index + 1}/${chunks.length}`);
            const processedChunk = this.processFeatureChunk(chunk);
            processedChunks.push(processedChunk);
        });
        
        return {
            type: 'FeatureCollection',
            features: processedChunks.flat()
        };
    }
    
    chunkFeatures(features, chunkSize) {
        const chunks = [];
        for (let i = 0; i < features.length; i += chunkSize) {
            chunks.push(features.slice(i, i + chunkSize));
        }
        return chunks;
    }
    
    processFeatureChunk(features) {
        return features.map(feature => {
            // Simplify geometry for performance
            if (feature.geometry.type === 'Polygon') {
                feature.geometry.coordinates = this.simplifyPolygon(
                    feature.geometry.coordinates, 
                    this.simplificationTolerance
                );
            }
            
            // Extract relevant properties for 3D visualization
            const properties = this.extractVisualizationProperties(feature.properties);
            
            return {
                ...feature,
                properties: properties
            };
        }).filter(feature => this.isFeatureValid(feature));
    }
    
    simplifyPolygon(coordinates, tolerance) {
        // Implement Douglas-Peucker simplification or similar
        // This is a simplified version - use a proper library like Turf.js in production
        return coordinates.map(ring => {
            if (ring.length <= 3) return ring; // Can't simplify triangles
            
            return ring.filter((point, index) => {
                if (index === 0 || index === ring.length - 1) return true; // Keep first and last
                
                const prev = ring[index - 1];
                const curr = point;
                const next = ring[index + 1];
                
                // Simple distance-based filter (replace with proper algorithm)
                const distance = this.pointToLineDistance(curr, prev, next);
                return distance > tolerance;
            });
        });
    }
    
    pointToLineDistance(point, lineStart, lineEnd) {
        const [px, py] = point;
        const [lsx, lsy] = lineStart;
        const [lex, ley] = lineEnd;
        
        const A = px - lsx;
        const B = py - lsy;
        const C = lex - lsx;
        const D = ley - lsy;
        
        const dot = A * C + B * D;
        const lenSq = C * C + D * D;
        
        if (lenSq === 0) return Math.sqrt(A * A + B * B);
        
        const param = dot / lenSq;
        
        let xx, yy;
        if (param < 0) {
            xx = lsx;
            yy = lsy;
        } else if (param > 1) {
            xx = lex;
            yy = ley;
        } else {
            xx = lsx + param * C;
            yy = lsy + param * D;
        }
        
        const dx = px - xx;
        const dy = py - yy;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    extractVisualizationProperties(properties) {
        // Extract only properties needed for 3D visualization
        return {
            height: properties.height || properties.building_height || null,
            type: properties.building || properties.type || 'unknown',
            color: properties.color || null,
            material: properties.material || null,
            levels: properties.building_levels || null,
            name: properties.name || null
        };
    }
    
    isFeatureValid(feature) {
        // Validate feature for 3D visualization
        if (!feature.geometry || !feature.geometry.coordinates) return false;
        if (feature.geometry.type === 'Polygon' && feature.geometry.coordinates[0].length < 3) return false;
        return true;
    }
}
```

### 3D City Database Integration
```javascript
// Integration with 3D City Database (CityGML) data
class CityGMLProcessor {
    constructor() {
        this.lodLevels = {
            LOD1: 'simple_building_blocks',
            LOD2: 'detailed_building_models',
            LOD3: 'architectural_models',
            LOD4: 'interior_building_models'
        };
    }
    
    processCityGMLData(cityGMLData, targetLOD = 'LOD2') {
        console.log(`Processing CityGML data at ${targetLOD}`);
        
        const buildings = this.extractBuildings(cityGMLData, targetLOD);
        const terrain = this.extractTerrain(cityGMLData);
        const vegetation = this.extractVegetation(cityGMLData);
        
        return {
            buildings: buildings,
            terrain: terrain,
            vegetation: vegetation,
            metadata: this.extractMetadata(cityGMLData)
        };
    }
    
    extractBuildings(cityGMLData, targetLOD) {
        const buildings = [];
        
        cityGMLData.cityObjectMembers?.forEach(member => {
            if (member.building) {
                const building = this.processCityGMLBuilding(member.building, targetLOD);
                if (building) buildings.push(building);
            }
        });
        
        return buildings;
    }
    
    processCityGMLBuilding(buildingData, targetLOD) {
        // Extract geometry based on LOD level
        const geometry = this.extractBuildingGeometry(buildingData, targetLOD);
        if (!geometry) return null;
        
        // Extract appearance information
        const appearance = this.extractAppearance(buildingData);
        
        // Extract semantic information
        const semantics = this.extractSemantics(buildingData);
        
        return {
            id: buildingData.id || buildingData.gml_id,
            geometry: geometry,
            appearance: appearance,
            semantics: semantics,
            lod: targetLOD
        };
    }
    
    extractBuildingGeometry(buildingData, targetLOD) {
        // Extract geometry based on specified LOD
        const lodGeometry = buildingData[`lod${targetLOD.slice(-1)}`];
        if (!lodGeometry) {
            // Fallback to available LOD
            for (let i = 1; i <= 4; i++) {
                const fallbackGeometry = buildingData[`lod${i}`];
                if (fallbackGeometry) {
                    console.log(`Using LOD${i} as fallback for building ${buildingData.id}`);
                    return this.convertCityGMLGeometry(fallbackGeometry);
                }
            }
            return null;
        }
        
        return this.convertCityGMLGeometry(lodGeometry);
    }
    
    convertCityGMLGeometry(cityGMLGeometry) {
        // Convert CityGML geometry to Three.js compatible format
        if (cityGMLGeometry.solid) {
            return this.processSolidGeometry(cityGMLGeometry.solid);
        } else if (cityGMLGeometry.multiSurface) {
            return this.processMultiSurfaceGeometry(cityGMLGeometry.multiSurface);
        } else if (cityGMLGeometry.compositeSurface) {
            return this.processCompositeSurfaceGeometry(cityGMLGeometry.compositeSurface);
        }
        
        return null;
    }
    
    processSolidGeometry(solidGeometry) {
        // Process 3D solid geometry (LOD2+)
        const surfaces = [];
        
        solidGeometry.exterior?.compositeSurface?.surfaces?.forEach(surface => {
            const triangles = this.triangulatePolygon(surface.polygon);
            surfaces.push(...triangles);
        });
        
        return {
            type: 'solid',
            vertices: this.extractVertices(surfaces),
            faces: this.extractFaces(surfaces),
            normals: this.calculateNormals(surfaces)
        };
    }
    
    processMultiSurfaceGeometry(multiSurfaceGeometry) {
        // Process multi-surface geometry (LOD1)
        const surfaces = [];
        
        multiSurfaceGeometry.surfaces?.forEach(surface => {
            if (surface.polygon) {
                const triangles = this.triangulatePolygon(surface.polygon);
                surfaces.push(...triangles);
            }
        });
        
        return {
            type: 'multiSurface',
            vertices: this.extractVertices(surfaces),
            faces: this.extractFaces(surfaces),
            normals: this.calculateNormals(surfaces)
        };
    }
    
    triangulatePolygon(polygon) {
        // Implement polygon triangulation for complex building shapes
        // This is a simplified version - use a proper library like Earcut
        const exterior = polygon.exterior.linearRing.coordinates;
        const holes = polygon.interior?.map(hole => hole.linearRing.coordinates) || [];
        
        // Simple triangulation (replace with Earcut or similar)
        const triangles = [];
        for (let i = 1; i < exterior.length - 1; i++) {
            triangles.push([exterior[0], exterior[i], exterior[i + 1]]);
        }
        
        return triangles;
    }
    
    extractAppearance(buildingData) {
        // Extract texture and material information
        const appearance = {
            textures: [],
            materials: [],
            themes: []
        };
        
        if (buildingData.appearance) {
            buildingData.appearance.forEach(app => {
                if (app.x3dMaterial) {
                    appearance.materials.push({
                        diffuseColor: app.x3dMaterial.diffuseColor,
                        specularColor: app.x3dMaterial.specularColor,
                        emissiveColor: app.x3dMaterial.emissiveColor,
                        shininess: app.x3dMaterial.shininess,
                        transparency: app.x3dMaterial.transparency
                    });
                }
                
                if (app.parameterizedTexture) {
                    appearance.textures.push({
                        imageURI: app.parameterizedTexture.imageURI,
                        textureCoordinates: app.parameterizedTexture.textureCoordinates,
                        wrapMode: app.parameterizedTexture.wrapMode
                    });
                }
            });
        }
        
        return appearance;
    }
    
    extractSemantics(buildingData) {
        // Extract semantic building information
        return {
            function: buildingData.function || [],
            usage: buildingData.usage || [],
            class: buildingData.class || null,
            yearOfConstruction: buildingData.yearOfConstruction || null,
            yearOfDemolition: buildingData.yearOfDemolition || null,
            roofType: buildingData.roofType || null,
            measuredHeight: buildingData.measuredHeight || null,
            storeysAboveGround: buildingData.storeysAboveGround || null,
            storeysBelowGround: buildingData.storeysBelowGround || null
        };
    }
}
```

## Performance Monitoring and Optimization

### Performance Monitoring System
```javascript
// Comprehensive performance monitoring for Three.js visualization
class PerformanceMonitor {
    constructor() {
        this.stats = {
            fps: 0,
            frameTime: 0,
            memoryUsage: 0,
            geometries: 0,
            textures: 0,
            drawCalls: 0
        };
        
        this.frameCount = 0;
        this.lastTime = performance.now();
        this.enabled = true;
    }
    
    update(renderer) {
        if (!this.enabled) return;
        
        const currentTime = performance.now();
        this.frameCount++;
        
        // Calculate FPS every second
        if (currentTime - this.lastTime >= 1000) {
            this.stats.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
            this.stats.frameTime = (currentTime - this.lastTime) / this.frameCount;
            this.frameCount = 0;
            this.lastTime = currentTime;
            
            // Update rendering statistics
            this.updateRenderingStats(renderer);
            
            // Check for performance issues
            this.checkPerformanceThresholds();
        }
    }
    
    updateRenderingStats(renderer) {
        const info = renderer.info;
        
        this.stats.geometries = info.memory.geometries;
        this.stats.textures = info.memory.textures;
        this.stats.drawCalls = info.render.calls;
        
        // Memory usage (if available)
        if (performance.memory) {
            this.stats.memoryUsage = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
        }
    }
    
    checkPerformanceThresholds() {
        const warnings = [];
        
        if (this.stats.fps < 30) {
            warnings.push(`Low FPS: ${this.stats.fps}`);
        }
        
        if (this.stats.drawCalls > 1000) {
            warnings.push(`High draw calls: ${this.stats.drawCalls}`);
        }
        
        if (this.stats.memoryUsage > 512) {
            warnings.push(`High memory usage: ${this.stats.memoryUsage}MB`);
        }
        
        if (warnings.length > 0) {
            console.warn('Performance warnings:', warnings);
            this.onPerformanceWarning(warnings);
        }
    }
    
    onPerformanceWarning(warnings) {
        // Implement performance optimization strategies
        if (warnings.some(w => w.includes('Low FPS'))) {
            this.suggestFPSOptimizations();
        }
        
        if (warnings.some(w => w.includes('High draw calls'))) {
            this.suggestDrawCallOptimizations();
        }
        
        if (warnings.some(w => w.includes('High memory usage'))) {
            this.suggestMemoryOptimizations();
        }
    }
    
    suggestFPSOptimizations() {
        console.log('FPS Optimization suggestions:');
        console.log('- Reduce geometry complexity');
        console.log('- Implement LOD system');
        console.log('- Use instanced rendering for repeated objects');
        console.log('- Reduce shadow map resolution');
    }
    
    suggestDrawCallOptimizations() {
        console.log('Draw call optimization suggestions:');
        console.log('- Merge geometries where possible');
        console.log('- Use texture atlases');
        console.log('- Implement frustum culling');
        console.log('- Use instanced meshes');
    }
    
    suggestMemoryOptimizations() {
        console.log('Memory optimization suggestions:');
        console.log('- Dispose unused geometries and textures');
        console.log('- Reduce texture resolution');
        console.log('- Implement texture streaming');
        console.log('- Use geometry compression');
    }
    
    getPerformanceReport() {
        return {
            timestamp: new Date().toISOString(),
            stats: { ...this.stats },
            recommendations: this.generateRecommendations()
        };
    }
    
    generateRecommendations() {
        const recommendations = [];
        
        if (this.stats.fps < 60) {
            recommendations.push({
                type: 'performance',
                priority: 'high',
                message: 'Consider reducing scene complexity or implementing LOD'
            });
        }
        
        if (this.stats.drawCalls > 500) {
            recommendations.push({
                type: 'optimization',
                priority: 'medium',
                message: 'Consider batching geometry or using instanced rendering'
            });
        }
        
        return recommendations;
    }
}
```

### Asset Optimization System
```javascript
// Asset optimization for web delivery
class AssetOptimizer {
    constructor() {
        this.textureCache = new Map();
        this.geometryCache = new Map();
        this.compressionEnabled = true;
    }
    
    async optimizeTexture(texture, options = {}) {
        const cacheKey = `${texture.image.src}_${JSON.stringify(options)}`;
        
        if (this.textureCache.has(cacheKey)) {
            return this.textureCache.get(cacheKey);
        }
        
        const optimizedTexture = texture.clone();
        
        // Resize texture if needed
        if (options.maxSize) {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            const img = texture.image;
            const scale = Math.min(options.maxSize / img.width, options.maxSize / img.height);
            
            if (scale < 1) {
                canvas.width = img.width * scale;
                canvas.height = img.height * scale;
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                
                optimizedTexture.image = canvas;
                optimizedTexture.needsUpdate = true;
            }
        }
        
        // Apply compression settings
        if (this.compressionEnabled) {
            optimizedTexture.generateMipmaps = options.generateMipmaps !== false;
            optimizedTexture.minFilter = options.minFilter || THREE.LinearMipmapLinearFilter;
            optimizedTexture.magFilter = options.magFilter || THREE.LinearFilter;
        }
        
        this.textureCache.set(cacheKey, optimizedTexture);
        return optimizedTexture;
    }
    
    optimizeGeometry(geometry, options = {}) {
        const cacheKey = `geometry_${geometry.uuid}_${JSON.stringify(options)}`;
        
        if (this.geometryCache.has(cacheKey)) {
            return this.geometryCache.get(cacheKey);
        }
        
        const optimizedGeometry = geometry.clone();
        
        // Merge vertices if requested
        if (options.mergeVertices) {
            optimizedGeometry.mergeVertices();
        }
        
        // Simplify geometry if requested
        if (options.simplificationRatio && options.simplificationRatio < 1) {
            // Note: In production, use a proper geometry simplification library
            console.log(`Simplifying geometry by ratio: ${options.simplificationRatio}`);
        }
        
        // Compute efficient normals and tangents
        if (!optimizedGeometry.attributes.normal) {
            optimizedGeometry.computeVertexNormals();
        }
        
        // Remove unused vertex attributes
        if (options.removeUnusedAttributes) {
            this.removeUnusedAttributes(optimizedGeometry);
        }
        
        this.geometryCache.set(cacheKey, optimizedGeometry);
        return optimizedGeometry;
    }
    
    removeUnusedAttributes(geometry) {
        const usedAttributes = ['position', 'normal', 'uv'];
        const attributes = Object.keys(geometry.attributes);
        
        attributes.forEach(attr => {
            if (!usedAttributes.includes(attr)) {
                delete geometry.attributes[attr];
            }
        });
    }
    
    // Batch multiple geometries into single draw call
    batchGeometries(geometries, materials) {
        const batches = new Map();
        
        // Group by material for batching
        geometries.forEach((geometry, index) => {
            const material = materials[index];
            const materialKey = this.getMaterialKey(material);
            
            if (!batches.has(materialKey)) {
                batches.set(materialKey, {
                    geometries: [],
                    material: material,
                    transforms: []
                });
            }
            
            batches.get(materialKey).geometries.push(geometry);
        });
        
        // Create batched meshes
        const batchedMeshes = [];
        batches.forEach((batch, materialKey) => {
            if (batch.geometries.length > 1) {
                const mergedGeometry = this.mergeGeometries(batch.geometries);
                const batchedMesh = new THREE.Mesh(mergedGeometry, batch.material);
                batchedMeshes.push(batchedMesh);
            } else {
                // Single geometry, no batching needed
                const mesh = new THREE.Mesh(batch.geometries[0], batch.material);
                batchedMeshes.push(mesh);
            }
        });
        
        return batchedMeshes;
    }
    
    mergeGeometries(geometries) {
        // Simple geometry merging - in production, use THREE.BufferGeometryUtils
        const merged = new THREE.BufferGeometry();
        
        let positionCount = 0;
        let normalCount = 0;
        let uvCount = 0;
        
        // Calculate total attribute sizes
        geometries.forEach(geo => {
            positionCount += geo.attributes.position.count;
            if (geo.attributes.normal) normalCount += geo.attributes.normal.count;
            if (geo.attributes.uv) uvCount += geo.attributes.uv.count;
        });
        
        // Create merged attributes
        const positions = new Float32Array(positionCount * 3);
        const normals = normalCount > 0 ? new Float32Array(normalCount * 3) : null;
        const uvs = uvCount > 0 ? new Float32Array(uvCount * 2) : null;
        
        let posOffset = 0;
        let normalOffset = 0;
        let uvOffset = 0;
        
        geometries.forEach(geo => {
            // Copy positions
            const geoPositions = geo.attributes.position.array;
            positions.set(geoPositions, posOffset);
            posOffset += geoPositions.length;
            
            // Copy normals
            if (geo.attributes.normal && normals) {
                const geoNormals = geo.attributes.normal.array;
                normals.set(geoNormals, normalOffset);
                normalOffset += geoNormals.length;
            }
            
            // Copy UVs
            if (geo.attributes.uv && uvs) {
                const geoUVs = geo.attributes.uv.array;
                uvs.set(geoUVs, uvOffset);
                uvOffset += geoUVs.length;
            }
        });
        
        merged.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        if (normals) merged.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
        if (uvs) merged.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
        
        return merged;
    }
    
    getMaterialKey(material) {
        // Create unique key for material batching
        return `${material.constructor.name}_${material.color?.getHex() || 0}_${material.map?.uuid || 'nomap'}`;
    }
    
    dispose() {
        this.textureCache.forEach(texture => texture.dispose());
        this.geometryCache.forEach(geometry => geometry.dispose());
        this.textureCache.clear();
        this.geometryCache.clear();
    }
}
```

## Testing and Validation Framework

### Comprehensive Testing System
```javascript
// Testing framework for Three.js visualization components
class VisualizationTester {
    constructor() {
        this.testResults = [];
        this.testScene = null;
        this.testRenderer = null;
    }
    
    async runAllTests() {
        console.log('Starting comprehensive visualization tests...');
        
        this.setupTestEnvironment();
        
        const tests = [
            this.testSceneInitialization,
            this.testGeometryCreation,
            this.testMaterialApplication,
            this.testLightingSetup,
            this.testTextureLoading,
            this.testPerformanceMetrics,
            this.testResponsiveDesign,
            this.testDataIntegration,
            this.testErrorHandling
        ];
        
        for (const test of tests) {
            try {
                await test.call(this);
            } catch (error) {
                this.logTestResult(test.name, false, error.message);
            }
        }
        
        this.generateTestReport();
        this.cleanupTestEnvironment();
    }
    
    setupTestEnvironment() {
        // Create minimal test scene
        this.testScene = new THREE.Scene();
        this.testRenderer = new THREE.WebGLRenderer({ 
            canvas: document.createElement('canvas'),
            antialias: false 
        });
        this.testRenderer.setSize(256, 256); // Small test size
    }
    
    async testSceneInitialization() {
        console.log('Testing scene initialization...');
        
        // Test basic scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();
        
        // Validate scene properties
        this.assert(scene instanceof THREE.Scene, 'Scene creation failed');
        this.assert(camera instanceof THREE.PerspectiveCamera, 'Camera creation failed');
        this.assert(renderer instanceof THREE.WebGLRenderer, 'Renderer creation failed');
        
        // Test scene hierarchy
        const testMesh = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshBasicMaterial({ color: 0xff0000 })
        );
        scene.add(testMesh);
        
        this.assert(scene.children.length === 1, 'Scene hierarchy failed');
        this.assert(scene.children[0] === testMesh, 'Mesh addition failed');
        
        this.logTestResult('testSceneInitialization', true);
    }
    
    async testGeometryCreation() {
        console.log('Testing geometry creation...');
        
        // Test building geometry creation
        const buildingData = {
            footprint: {
                coordinates: [[[0, 0], [10, 0], [10, 10], [0, 10], [0, 0]]]
            },
            height: 20
        };
        
        const shape = new THREE.Shape();
        buildingData.footprint.coordinates[0].forEach((coord, index) => {
            if (index === 0) {
                shape.moveTo(coord[0], coord[1]);
            } else {
                shape.lineTo(coord[0], coord[1]);
            }
        });
        
        const extrudeSettings = {
            depth: buildingData.height,
            bevelEnabled: false
        };
        
        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        
        this.assert(geometry instanceof THREE.ExtrudeGeometry, 'Building geometry creation failed');
        this.assert(geometry.attributes.position.count > 0, 'Geometry has no vertices');
        
        // Test terrain geometry
        const terrainGeometry = new THREE.PlaneGeometry(100, 100, 50, 50);
        this.assert(terrainGeometry instanceof THREE.PlaneGeometry, 'Terrain geometry creation failed');
        
        this.logTestResult('testGeometryCreation', true);
    }
    
    async testMaterialApplication() {
        console.log('Testing material application...');
        
        // Test PBR material creation
        const material = new THREE.MeshStandardMaterial({
            color: 0x888888,
            roughness: 0.7,
            metalness: 0.1
        });
        
        this.assert(material instanceof THREE.MeshStandardMaterial, 'PBR material creation failed');
        this.assert(material.roughness === 0.7, 'Material roughness not set correctly');
        this.assert(material.metalness === 0.1, 'Material metalness not set correctly');
        
        // Test texture application
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = 64;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(0, 0, 64, 64);
        
        const texture = new THREE.CanvasTexture(canvas);
        material.map = texture;
        
        this.assert(material.map === texture, 'Texture application failed');
        
        this.logTestResult('testMaterialApplication', true);
    }
    
    async testLightingSetup() {
        console.log('Testing lighting setup...');
        
        const scene = new THREE.Scene();
        
        // Test ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
        scene.add(ambientLight);
        
        // Test directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(100, 100, 50);
        directionalLight.castShadow = true;
        scene.add(directionalLight);
        
        // Test point light
        const pointLight = new THREE.PointLight(0xffffff, 0.5, 100);
        pointLight.position.set(50, 30, 50);
        scene.add(pointLight);
        
        this.assert(scene.children.length === 3, 'Light addition failed');
        this.assert(directionalLight.castShadow === true, 'Shadow casting not enabled');
        
        this.logTestResult('testLightingSetup', true);
    }
    
    async testTextureLoading() {
        console.log('Testing texture loading...');
        
        // Test fallback texture creation
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = 1;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#888888';
        ctx.fillRect(0, 0, 1, 1);
        
        const fallbackTexture = new THREE.CanvasTexture(canvas);
        
        this.assert(fallbackTexture instanceof THREE.CanvasTexture, 'Fallback texture creation failed');
        this.assert(fallbackTexture.image === canvas, 'Texture canvas assignment failed');
        
        // Test texture configuration
        fallbackTexture.wrapS = THREE.RepeatWrapping;
        fallbackTexture.wrapT = THREE.RepeatWrapping;
        fallbackTexture.repeat.set(2, 2);
        
        this.assert(fallbackTexture.wrapS === THREE.RepeatWrapping, 'Texture wrap mode failed');
        this.assert(fallbackTexture.repeat.x === 2, 'Texture repeat failed');
        
        this.logTestResult('testTextureLoading', true);
    }
    
    async testPerformanceMetrics() {
        console.log('Testing performance metrics...');
        
        const startTime = performance.now();
        
        // Create test scene with multiple objects
        const scene = new THREE.Scene();
        const renderer = this.testRenderer;
        
        for (let i = 0; i < 100; i++) {
            const geometry = new THREE.BoxGeometry(1, 1, 1);
            const material = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20
            );
            scene.add(mesh);
        }
        
        const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        camera.position.z = 30;
        
        // Render multiple frames
        for (let i = 0; i < 10; i++) {
            renderer.render(scene, camera);
        }
        
        const endTime = performance.now();
        const renderTime = endTime - startTime;
        
        this.assert(renderTime < 1000, 'Rendering performance too slow'); // Should render in under 1 second
        this.assert(scene.children.length === 100, 'Scene object count incorrect');
        
        // Cleanup
        scene.children.forEach(child => {
            if (child.geometry) child.geometry.dispose();
            if (child.material) child.material.dispose();
        });
        
        this.logTestResult('testPerformanceMetrics', true);
    }
    
    async testResponsiveDesign() {
        console.log('Testing responsive design...');
        
        const renderer = this.testRenderer;
        const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        
        // Test different viewport sizes
        const testSizes = [
            { width: 320, height: 568 },  // Mobile
            { width: 768, height: 1024 }, // Tablet
            { width: 1920, height: 1080 } // Desktop
        ];
        
        testSizes.forEach(size => {
            renderer.setSize(size.width, size.height);
            camera.aspect = size.width / size.height;
            camera.updateProjectionMatrix();
            
            this.assert(renderer.domElement.width === size.width, `Renderer width not set correctly for ${size.width}x${size.height}`);
            this.assert(renderer.domElement.height === size.height, `Renderer height not set correctly for ${size.width}x${size.height}`);
            this.assert(Math.abs(camera.aspect - (size.width / size.height)) < 0.001, `Camera aspect ratio incorrect for ${size.width}x${size.height}`);
        });
        
        this.logTestResult('testResponsiveDesign', true);
    }
    
    async testDataIntegration() {
        console.log('Testing data integration...');
        
        // Test GeoJSON processing
        const mockGeoJSON = {
            type: 'FeatureCollection',
            features: [
                {
                    type: 'Feature',
                    geometry: {
                        type: 'Polygon',
                        coordinates: [[[0, 0], [10, 0], [10, 10], [0, 10], [0, 0]]]
                    },
                    properties: {
                        height: 20,
                        type: 'building'
                    }
                }
            ]
        };
        
        this.assert(mockGeoJSON.features.length === 1, 'GeoJSON feature count incorrect');
        this.assert(mockGeoJSON.features[0].geometry.type === 'Polygon', 'GeoJSON geometry type incorrect');
        
        // Test coordinate conversion
        const feature = mockGeoJSON.features[0];
        const coordinates = feature.geometry.coordinates[0];
        
        this.assert(coordinates.length === 5, 'Polygon coordinate count incorrect'); // Including closing coordinate
        this.assert(coordinates[0][0] === coordinates[4][0], 'Polygon not properly closed');
        
        this.logTestResult('testDataIntegration', true);
    }
    
    async testErrorHandling() {
        console.log('Testing error handling...');
        
        let errorCaught = false;
        
        // Test invalid geometry handling
        try {
            const invalidShape = new THREE.Shape();
            // Don't add any points to shape
            const geometry = new THREE.ExtrudeGeometry(invalidShape, { depth: 10 });
        } catch (error) {
            errorCaught = true;
        }
        
        // Test texture loading error handling
        const loader = new THREE.TextureLoader();
        let textureError = false;
        
        loader.load(
            'invalid-texture-url.jpg',
            (texture) => {
                // Success callback - should not be called
            },
            (progress) => {
                // Progress callback
            },
            (error) => {
                textureError = true;
            }
        );
        
        // Wait a bit for async operations
        await new Promise(resolve => setTimeout(resolve, 100));
        
        this.assert(textureError === true, 'Texture loading error not handled');
        
        this.logTestResult('testErrorHandling', true);
    }
    
    assert(condition, message) {
        if (!condition) {
            throw new Error(`Assertion failed: ${message}`);
        }
    }
    
    logTestResult(testName, passed, errorMessage = null) {
        this.testResults.push({
            test: testName,
            passed: passed,
            error: errorMessage,
            timestamp: new Date().toISOString()
        });
        
        if (passed) {
            console.log(`✅ ${testName} passed`);
        } else {
            console.log(`❌ ${testName} failed: ${errorMessage}`);
        }
    }
    
    generateTestReport() {
        const totalTests = this.testResults.length;
        const passedTests = this.testResults.filter(r => r.passed).length;
        const failedTests = totalTests - passedTests;
        
        console.log('\n=== TEST REPORT ===');
        console.log(`Total tests: ${totalTests}`);
        console.log(`Passed: ${passedTests}`);
        console.log(`Failed: ${failedTests}`);
        console.log(`Success rate: ${Math.round((passedTests / totalTests) * 100)}%`);
        
        if (failedTests > 0) {
            console.log('\nFailed tests:');
            this.testResults.filter(r => !r.passed).forEach(result => {
                console.log(`- ${result.test}: ${result.error}`);
            });
        }
        
        return {
            total: totalTests,
            passed: passedTests,
            failed: failedTests,
            successRate: (passedTests / totalTests) * 100,
            results: this.testResults
        };
    }
    
    cleanupTestEnvironment() {
        if (this.testRenderer) {
            this.testRenderer.dispose();
        }
        this.testScene = null;
        this.testRenderer = null;
    }
}
```

## Deployment and Integration Guidelines

### Laravel Integration Patterns
```javascript
// Integration patterns for Laravel backend communication
class LaravelIntegration {
    constructor(baseUrl = '/api/visualization') {
        this.baseUrl = baseUrl;
        this.csrfToken = this.getCSRFToken();
    }
    
    getCSRFToken() {
        // Get CSRF token from Laravel meta tag
        const token = document.querySelector('meta[name="csrf-token"]');
        return token ? token.getAttribute('content') : null;
    }
    
    async processAddress(address) {
        const response = await fetch(`${this.baseUrl}/process-address`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': this.csrfToken,
                'Accept': 'application/json'
            },
            body: JSON.stringify({ address: address })
        });
        
        if (!response.ok) {
            throw new Error(`Address processing failed: ${response.statusText}`);
        }
        
        const data = await response.json();
        return data;
    }
    
    async getVisualizationData(coordinates, radius = 500) {
        const params = new URLSearchParams({
            lat: coordinates.latitude,
            lng: coordinates.longitude,
            radius: radius
        });
        
        const response = await fetch(`${this.baseUrl}/data?${params}`, {
            headers: {
                'Accept': 'application/json',
                'X-CSRF-TOKEN': this.csrfToken
            }
        });
        
        if (!response.ok) {
            throw new Error(`Data fetch failed: ${response.statusText}`);
        }
        
        return await response.json();
    }
    
    async downloadModel(type, format = 'stl') {
        const response = await fetch(`${this.baseUrl}/download/${type}/${format}`, {
            headers: {
                'X-CSRF-TOKEN': this.csrfToken
            }
        });
        
        if (!response.ok) {
            throw new Error(`Model download failed: ${response.statusText}`);
        }
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${type}_model.${format}`;
        a.click();
        window.URL.revokeObjectURL(url);
    }
}
```

### Application Initialization
```javascript
// Main application initialization and coordination
class SanDiegoVisualizer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        
        this.materialManager = new MaterialManager();
        this.terrainGenerator = new TerrainGenerator();
        this.vegetationGenerator = new VegetationGenerator();
        this.performanceMonitor = new PerformanceMonitor();
        this.assetOptimizer = new AssetOptimizer();
        this.laravelIntegration = new LaravelIntegration();
        
        this.currentData = null;
        this.initialized = false;
    }
    
    async initialize() {
        if (this.initialized) return;
        
        console.log('Initializing San Diego 3D Geospatial Visualizer...');
        
        try {
            // Initialize Three.js components
            this.initializeThreeJS();
            
            // Setup lighting
            this.setupLighting();
            
            // Initialize subsystems
            await this.vegetationGenerator.initialize();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Start animation loop
            this.startAnimationLoop();
            
            this.initialized = true;
            console.log('Visualizer initialized successfully');
            
        } catch (error) {
            console.error('Initialization failed:', error);
            throw error;
        }
    }
    
    initializeThreeJS() {
        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB);
        
        // Camera setup
        this.camera = new THREE.PerspectiveCamera(
            75,
            this.container.clientWidth / this.container.clientHeight,
            0.1,
            10000
        );
        this.camera.position.set(200, 150, 200);
        
        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true 
        });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        
        this.container.appendChild(this.renderer.domElement);
        
        // Controls setup
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.1;
        this.controls.minDistance = 10;
        this.controls.maxDistance = 2000;
        this.controls.maxPolarAngle = Math.PI / 2;
    }
    
    setupLighting() {
        const lights = setupLighting(this.scene);
        this.lights = lights;
    }
    
    setupEventListeners() {
        // Window resize handling
        window.addEventListener('resize', () => this.onWindowResize());
        
        // Address input handling (if form exists)
        const addressForm = document.getElementById('address-form');
        if (addressForm) {
            addressForm.addEventListener('submit', (e) => this.handleAddressSubmit(e));
        }
        
        // Download buttons
        document.querySelectorAll('[data-download]').forEach(button => {
            button.addEventListener('click', (e) => this.handleDownload(e));
        });
    }
    
    onWindowResize() {
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }
    
    async handleAddressSubmit(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const address = formData.get('address');
        
        if (!address) {
            this.showError('Please enter an address');
            return;
        }
        
        try {
            this.showLoading(true);
            
            // Process address through Laravel backend
            const addressData = await this.laravelIntegration.processAddress(address);
            
            // Get visualization data
            const visualizationData = await this.laravelIntegration.getVisualizationData(
                addressData.coordinates
            );
            
            // Clear existing scene
            this.clearScene();
            
            // Render new data
            await this.renderVisualizationData(visualizationData);
            
            this.currentData = visualizationData;
            this.showLoading(false);
            
        } catch (error) {
            console.error('Address processing failed:', error);
            this.showError('Failed to process address. Please try again.');
            this.showLoading(false);
        }
    }
    
    async renderVisualizationData(data) {
        console.log('Rendering visualization data...');
        
        // Render terrain
        if (data.terrain) {
            await this.renderTerrain(data.terrain);
        }
        
        // Render buildings
        if (data.buildings) {
            await this.renderBuildings(data.buildings);
        }
        
        // Render vegetation
        if (data.vegetation) {
            await this.renderVegetation(data.vegetation);
        }
        
        // Position camera for optimal view
        this.positionCameraForData(data);
    }
    
    async renderTerrain(terrainData) {
        const terrain = await this.terrainGenerator.createTerrain(
            terrainData.heightmapUrl,
            terrainData.textureConfig
        );
        this.scene.add(terrain);
    }
    
    async renderBuildings(buildingsData) {
        const buildings = processBuildingData(buildingsData);
        buildings.forEach(building => this.scene.add(building));
    }
    
    async renderVegetation(vegetationData) {
        const vegetation = this.vegetationGenerator.generateTreesFromData(
            vegetationData.positions,
            this.getTerrainMesh()
        );
        this.scene.add(vegetation);
    }
    
    getTerrainMesh() {
        return this.scene.children.find(child => 
            child.geometry instanceof THREE.PlaneGeometry && 
            child.material.displacementMap
        );
    }
    
    positionCameraForData(data) {
        if (data.bounds) {
            const center = {
                x: (data.bounds.minX + data.bounds.maxX) / 2,
                z: (data.bounds.minZ + data.bounds.maxZ) / 2
            };
            
            const size = Math.max(
                data.bounds.maxX - data.bounds.minX,
                data.bounds.maxZ - data.bounds.minZ
            );
            
            const distance = size * 1.5; // Adjust multiplier as needed
            this.camera.position.set(center.x + distance, distance, center.z + distance);
            this.controls.target.set(center.x, 0, center.z);
            this.controls.update();
        }
    }
    
    clearScene() {
        // Remove all objects except lights
        const objectsToRemove = [];
        this.scene.traverse(child => {
            if (!(child instanceof THREE.Light) && child !== this.scene) {
                objectsToRemove.push(child);
            }
        });
        
        objectsToRemove.forEach(obj => {
            this.scene.remove(obj);
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) {
                if (Array.isArray(obj.material)) {
                    obj.material.forEach(mat => mat.dispose());
                } else {
                    obj.material.dispose();
                }
            }
        });
    }
    
    handleDownload(event) {
        const type = event.target.getAttribute('data-download');
        const format = event.target.getAttribute('data-format') || 'stl';
        
        if (!this.currentData) {
            this.showError('No data available for download');
            return;
        }
        
        this.laravelIntegration.downloadModel(type, format)
            .catch(error => {
                console.error('Download failed:', error);
                this.showError('Download failed. Please try again.');
            });
    }
    
    startAnimationLoop() {
        const animate = () => {
            requestAnimationFrame(animate);
            
            // Update controls
            this.controls.update();
            
            // Update performance monitoring
            this.performanceMonitor.update(this.renderer);
            
            // Render scene
            this.renderer.render(this.scene, this.camera);
        };
        
        animate();
    }
    
    showLoading(show) {
        const loader = document.getElementById('loading-indicator');
        if (loader) {
            loader.style.display = show ? 'block' : 'none';
        }
    }
    
    showError(message) {
        const errorDiv = document.getElementById('error-message');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
            setTimeout(() => {
                errorDiv.style.display = 'none';
            }, 5000);
        } else {
            alert(message); // Fallback
        }
    }
    
    dispose() {
        // Cleanup all resources
        this.clearScene();
        this.materialManager.dispose();
        this.assetOptimizer.dispose();
        
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        // Remove event listeners
        window.removeEventListener('resize', this.onWindowResize);
    }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const visualizer = new SanDiegoVisualizer('visualization-container');
    visualizer.initialize().catch(error => {
        console.error('Failed to initialize visualizer:', error);
    });
});
```

## Advanced Features and Future Enhancements

### WebXR Integration for Immersive Experiences
```javascript
// WebXR integration for VR/AR experiences
class WebXRIntegration {
    constructor(renderer, scene, camera) {
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;
        this.xrSupported = false;
        this.vrSession = null;
        this.arSession = null;
    }
    
    async initialize() {
        // Check for WebXR support
        if ('xr' in navigator) {
            try {
                this.xrSupported = await navigator.xr.isSessionSupported('immersive-vr');
                
                if (this.xrSupported) {
                    this.setupXRInterface();
                    console.log('WebXR VR support detected');
                }
                
                const arSupported = await navigator.xr.isSessionSupported('immersive-ar');
                if (arSupported) {
                    this.setupARInterface();
                    console.log('WebXR AR support detected');
                }
            } catch (error) {
                console.log('WebXR not available:', error);
            }
        }
    }
    
    setupXRInterface() {
        // Enable XR in renderer
        this.renderer.xr.enabled = true;
        
        // Create VR button
        const vrButton = document.createElement('button');
        vrButton.textContent = 'Enter VR';
        vrButton.onclick = () => this.startVRSession();
        document.body.appendChild(vrButton);
    }
    
    setupARInterface() {
        // Create AR button
        const arButton = document.createElement('button');
        arButton.textContent = 'Enter AR';
        arButton.onclick = () => this.startARSession();
        document.body.appendChild(arButton);
    }
    
    async startVRSession() {
        try {
            this.vrSession = await navigator.xr.requestSession('immersive-vr');
            await this.renderer.xr.setSession(this.vrSession);
            
            // Setup VR-specific scene modifications
            this.setupVRScene();
            
        } catch (error) {
            console.error('Failed to start VR session:', error);
        }
    }
    
    async startARSession() {
        try {
            this.arSession = await navigator.xr.requestSession('immersive-ar', {
                requiredFeatures: ['local-floor'],
                optionalFeatures: ['dom-overlay'],
                domOverlay: { root: document.getElementById('ar-overlay') }
            });
            
            await this.renderer.xr.setSession(this.arSession);
            
            // Setup AR-specific scene modifications
            this.setupARScene();
            
        } catch (error) {
            console.error('Failed to start AR session:', error);
        }
    }
    
    setupVRScene() {
        // Add VR-specific controllers and interactions
        const controller1 = this.renderer.xr.getController(0);
        const controller2 = this.renderer.xr.getController(1);
        
        this.scene.add(controller1);
        this.scene.add(controller2);
        
        // Add teleportation system for VR navigation
        this.setupTeleportation();
    }
    
    setupARScene() {
        // Modify scene for AR viewing
        this.scene.background = null; // Transparent background for AR
        
        // Add AR-specific UI elements
        this.setupARUI();
    }
    
    setupTeleportation() {
        // VR teleportation system implementation
        // This would include ray casting and movement mechanics
        console.log('Setting up VR teleportation system');
    }
    
    setupARUI() {
        // AR-specific user interface
        const arOverlay = document.getElementById('ar-overlay');
        if (arOverlay) {
            arOverlay.innerHTML = `
                <div class="ar-info-panel">
                    <h3>AR Mode Active</h3>
                    <p>Point your device at a surface to place the 3D model</p>
                </div>
            `;
        }
    }
}
```

### AI-Powered Procedural Generation
```javascript
// AI-powered features for enhanced procedural generation
class AIProceduralGenerator {
    constructor() {
        this.modelCache = new Map();
        this.generationRules = {
            buildings: {
                residential: { heightRange: [8, 25], style: 'modern' },
                commercial: { heightRange: [15, 80], style: 'glass' },
                industrial: { heightRange: [5, 15], style: 'utilitarian' }
            },
            vegetation: {
                coastal: ['palm', 'eucalyptus', 'cypress'],
                urban: ['oak', 'maple', 'pine'],
                park: ['various_deciduous', 'flowering_trees']
            }
        };
    }
    
    generateBuildingVariations(baseBuilding, context) {
        // AI-enhanced building generation based on context
        const variations = [];
        const buildingType = this.classifyBuildingType(baseBuilding, context);
        const rules = this.generationRules.buildings[buildingType];
        
        // Generate architectural details
        const details = this.generateArchitecturalDetails(baseBuilding, rules);
        
        // Apply contextual modifications
        const contextualFeatures = this.applyContextualFeatures(baseBuilding, context);
        
        return {
            ...baseBuilding,
            details: details,
            contextualFeatures: contextualFeatures,
            generatedVariations: variations
        };
    }
    
    classifyBuildingType(building, context) {
        // Simple classification based on size and location
        const area = this.calculateBuildingArea(building);
        const height = building.height || 20;
        
        if (context.zoning === 'residential' || area < 200) {
            return 'residential';
        } else if (height > 40 || context.zoning === 'commercial') {
            return 'commercial';
        } else {
            return 'industrial';
        }
    }
    
    generateArchitecturalDetails(building, rules) {
        const details = {
            windows: this.generateWindows(building, rules.style),
            roofFeatures: this.generateRoofFeatures(building, rules.style),
            facade: this.generateFacadeElements(building, rules.style)
        };
        
        return details;
    }
    
    generateWindows(building, style) {
        const windows = [];
        const floors = Math.floor((building.height || 20) / 3.5); // Approximate floor count
        
        // Generate window patterns based on style
        for (let floor = 1; floor <= floors; floor++) {
            const windowRow = this.generateWindowRow(building, floor, style);
            windows.push(...windowRow);
        }
        
        return windows;
    }
    
    generateWindowRow(building, floor, style) {
        const windows = [];
        const perimeter = this.calculateBuildingPerimeter(building);
        const windowSpacing = style === 'glass' ? 2 : 4; // Closer spacing for glass buildings
        
        // Simplified window generation along perimeter
        for (let position = 0; position < perimeter; position += windowSpacing) {
            windows.push({
                position: position,
                floor: floor,
                size: style === 'glass' ? 'large' : 'standard',
                style: style
            });
        }
        
        return windows;
    }
    
    generateVegetationWithAI(area, environmentalFactors) {
        // AI-enhanced vegetation placement
        const vegetation = [];
        const climate = this.determineClimate(environmentalFactors);
        const suitableSpecies = this.generationRules.vegetation[climate] || this.generationRules.vegetation.urban;
        
        // Generate placement positions with natural clustering
        const clusters = this.generateVegetationClusters(area, environmentalFactors);
        
        clusters.forEach(cluster => {
            const species = suitableSpecies[Math.floor(Math.random() * suitableSpecies.length)];
            const trees = this.generateTreeCluster(cluster, species, environmentalFactors);
            vegetation.push(...trees);
        });
        
        return vegetation;
    }
    
    determineClimate(factors) {
        // Simple climate determination for San Diego
        if (factors.distanceToCoast < 5000) return 'coastal';
        if (factors.parkArea > 0.3) return 'park';
        return 'urban';
    }
    
    generateVegetationClusters(area, factors) {
        const clusters = [];
        const density = this.calculateVegetationDensity(factors);
        
        // Generate natural-looking clusters
        for (let i = 0; i < density * area.size; i++) {
            const center = {
                x: area.minX + Math.random() * (area.maxX - area.minX),
                z: area.minZ + Math.random() * (area.maxZ - area.minZ)
            };
            
            const radius = 10 + Math.random() * 20; // Cluster radius
            const treeCount = 3 + Math.floor(Math.random() * 8); // Trees per cluster
            
            clusters.push({
                center: center,
                radius: radius,
                treeCount: treeCount
            });
        }
        
        return clusters;
    }
    
    generateTreeCluster(cluster, species, factors) {
        const trees = [];
        
        for (let i = 0; i < cluster.treeCount; i++) {
            // Generate position within cluster radius using normal distribution
            const angle = Math.random() * Math.PI * 2;
            const distance = this.normalDistribution(0, cluster.radius / 2);
            
            const position = {
                x: cluster.center.x + Math.cos(angle) * distance,
                z: cluster.center.z + Math.sin(angle) * distance,
                species: species,
                maturity: 0.7 + Math.random() * 0.3, // 70-100% mature
                health: 0.8 + Math.random() * 0.2 // 80-100% healthy
            };
            
            trees.push(position);
        }
        
        return trees;
    }
    
    normalDistribution(mean, stdDev) {
        // Box-Muller transformation for normal distribution
        let u = 0, v = 0;
        while(u === 0) u = Math.random(); // Converting [0,1) to (0,1)
        while(v === 0) v = Math.random();
        
        const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2 * Math.PI * v);
        return z * stdDev + mean;
    }
    
    calculateBuildingArea(building) {
        // Simple area calculation from footprint
        if (building.footprint && building.footprint.coordinates) {
            const coords = building.footprint.coordinates[0];
            return this.polygonArea(coords);
        }
        return 100; // Default area
    }
    
    polygonArea(coordinates) {
        let area = 0;
        const n = coordinates.length;
        
        for (let i = 0; i < n; i++) {
            const j = (i + 1) % n;
            area += coordinates[i][0] * coordinates[j][1];
            area -= coordinates[j][0] * coordinates[i][1];
        }
        
        return Math.abs(area) / 2;
    }
    
    calculateBuildingPerimeter(building) {
        if (building.footprint && building.footprint.coordinates) {
            const coords = building.footprint.coordinates[0];
            let perimeter = 0;
            
            for (let i = 0; i < coords.length - 1; i++) {
                const dx = coords[i + 1][0] - coords[i][0];
                const dy = coords[i + 1][1] - coords[i][1];
                perimeter += Math.sqrt(dx * dx + dy * dy);
            }
            
            return perimeter;
        }
        return 40; // Default perimeter
    }
    
    calculateVegetationDensity(factors) {
        let density = 0.1; // Base density
        
        // Increase density in parks
        if (factors.parkArea > 0.2) density *= 2;
        
        // Increase density near coast
        if (factors.distanceToCoast < 2000) density *= 1.5;
        
        // Decrease density in urban areas
        if (factors.buildingDensity > 0.6) density *= 0.5;
        
        return Math.min(density, 0.5); // Cap maximum density
    }
}
```

## Final Implementation Checklist

### Pre-Deployment Validation Checklist
- [ ] **Scene Initialization**: All Three.js components initialize without errors
- [ ] **Rendering Performance**: Maintains >30 FPS on target devices
- [ ] **Memory Management**: No memory leaks in extended usage
- [ ] **Responsive Design**: Adapts correctly to different viewport sizes
- [ ] **Material Loading**: All textures load with proper fallbacks
- [ ] **Data Integration**: Laravel backend communication functions correctly
- [ ] **Error Handling**: Graceful handling of all failure scenarios
- [ ] **User Interface**: All controls respond correctly to user input
- [ ] **Cross-Browser Compatibility**: Functions in Chrome, Firefox, Safari, Edge
- [ ] **Mobile Compatibility**: Touch controls work on mobile devices

### Code Quality Standards Checklist
- [ ] **No Global Variables**: All code properly scoped within classes/modules
- [ ] **Error Handling**: Try-catch blocks around all async operations
- [ ] **Resource Cleanup**: Proper disposal of geometries, materials, textures
- [ ] **Documentation**: Complex calculations and algorithms documented
- [ ] **Naming Conventions**: Consistent and descriptive variable/function names
- [ ] **Performance Annotations**: Performance-critical sections identified
- [ ] **Fallback Mechanisms**: Alternatives for failed data loads or API calls

### Security and Best Practices
- [ ] **CSRF Protection**: All Laravel API calls include CSRF tokens
- [ ] **Input Validation**: Address inputs validated before processing
- [ ] **XSS Prevention**: No direct DOM manipulation with user input
- [ ] **Resource Limits**: Safeguards against excessive memory usage
- [ ] **API Rate Limiting**: Proper handling of API rate limits

### Long-Term Maintenance Considerations
- [ ] **Version Compatibility**: Three.js version clearly documented
- [ ] **Dependency Management**: All external dependencies documented
- [ ] **Performance Monitoring**: Metrics collection for ongoing optimization
- [ ] **Update Pathways**: Clear process for updating 3D models and textures
- [ ] **Scalability Planning**: Architecture supports expansion beyond San Diego

## Important Notes
Agents do not run deep code like node or php tasks that are long running. 
Agents do not need to run npm, composer or php artisan commands. 
Agents can skip parts of a task that require long tasks and just for another approach. 
Agents do not need to build.
Agents do not run artisan migrations or other installations. 
Agents generate all code as best as possible without running composer or npm tools. 
Developers, code review and QA, devops users run builds and migrations. Agentic assitants will not run these. 

---
