-- ==============================================
-- Base de datos: bikestore
-- ==============================================
CREATE DATABASE IF NOT EXISTS bikestore;
USE bikestore;

-- =====================================================
-- 👤 TABLA: usuario
-- =====================================================
CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombres VARCHAR(50),
    apellidos VARCHAR(50),
    correo VARCHAR(100) UNIQUE,
    clave VARCHAR(255),
    rol ENUM('Administrador', 'Operario', 'Cliente'),
    direccion VARCHAR(150),
    telefono VARCHAR(20)
);

-- =====================================================
-- 🚲 TABLA: productos
-- =====================================================
CREATE TABLE productos (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    precio DECIMAL(18),
    image LONGTEXT,
    descripcion TEXT,
    marca VARCHAR(30),
    categoria VARCHAR(30),
    stock INT DEFAULT 0,
    stock_minimo INT DEFAULT 0
);

-- =====================================================
-- 📦 TABLA: pedido
-- =====================================================
CREATE TABLE pedido (
    id_pedido INT AUTO_INCREMENT PRIMARY KEY,
    fecha_pedido DATE DEFAULT (CURRENT_DATE),
    precio_total DECIMAL(18),
    descripcion TEXT,
    metodo_pago VARCHAR(50),
    id_usuario INT,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

-- =====================================================
-- 🧾 TABLA: detalle_pedido
-- =====================================================
CREATE TABLE detalle_pedido (
    id_pedido INT,
    id_producto INT,
    cantidad INT,
    precio_unitario DECIMAL(18),
    PRIMARY KEY (id_pedido, id_producto),
    FOREIGN KEY (id_pedido) REFERENCES pedido(id_pedido),
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
);

-- =====================================================
-- 📥 TABLA: entrada_insumo
-- =====================================================
CREATE TABLE entrada_insumo (
    id_entrada INT AUTO_INCREMENT PRIMARY KEY,
    descripcion TEXT,
    fecha_entrada DATE,
    costo_total_insumo INT
);

-- =====================================================
-- 🧩 TABLA: detalle_entrada
-- =====================================================
CREATE TABLE detalle_entrada (
    id_entrada INT,
    id_producto INT,
    cantidad INT,
    costo_insumo INT,
    PRIMARY KEY (id_entrada, id_producto),
    FOREIGN KEY (id_entrada) REFERENCES entrada_insumo(id_entrada),
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
);

-- =====================================================
-- 📌 INSERTAR PRODUCTOS (con imágenes URL)
-- =====================================================
INSERT INTO productos (nombre, precio, image, descripcion, marca, categoria, stock, stock_minimo) VALUES
-- 🚵‍♂️ Bicicletas de Montaña
('MTB Scott Scale 960', 3400000,
'https://www.tradeinn.com/f/14023/140237206_2/scott-velo-vtt-scale-rc-world-cup-29-gx-eagle-axs-rocker-controller.jpg',
'La Scott Scale 960 cuenta con cuadro de aluminio ligero y horquilla RockShox.',
'Scott', 'montaña', 11, 1),

('MTB Cannondale Trail 5', 3300000,
'https://www.rowertour.com/uploads/shop/2/6/4/3/7/6/rower-mtb-cannondale-trail-5-graphite-2.jpg',
'La Trail 5 es rígida, ágil y confiable para rutas exigentes.',
'Cannondale', 'montaña', 9, 1),

('MTB Merida Big Nine 300', 3100000,
'https://cdn.mtbdatabase.com/wp-content/uploads/2020/01/05221156/2020-Merida-BIG.NINE-300.jpeg',
'Una MTB equilibrada con frenos hidráulicos y transmisión Shimano.',
'Merida', 'montaña', 10, 1),

-- ⚡ Bicicletas Eléctricas
('E-Bike Trek FX+ 2', 6200000,
'https://tse1.mm.bing.net/th/id/OIP.CKe90rbBjB7lpnrHCbDXxAHaEO?cb=ucfimg2ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3',
'Ligera, silenciosa y con motor asistido ideal para la ciudad.',
'Trek', 'electrica', 6, 1),

('E-Bike Giant Explore E+ 1', 7400000,
'https://www.alpinbike.hu/data/termek/12334_1.jpg',
'Potente motor SyncDrive Sport, perfecta para terrenos mixtos.',
'Giant', 'electrica', 4, 1),

('E-Bike Specialized Turbo Vado SL', 8900000,
'https://tse4.mm.bing.net/th/id/OIP.ueB67D_7xeFq50FkDNnOggHaFL?cb=ucfimg2ucfimg=1&w=800&h=560&rs=1&pid=ImgDetMain&o=7&rm=3',
'Una e-bike ultraligera con autonomía superior y diseño premium.',
'Specialized', 'electrica', 3, 1),

-- 🚴‍♂️ Bicicletas de Ruta
('Ruta Cannondale CAAD Optimo 1', 5100000,
'https://www.koloshop.cz/media/a5/95/a595cd3b3795fcb9-1600-1600-f-80.jpg',
'Cuadro ligero y geometría enfocada en la velocidad.',
'Cannondale', 'ruta', 7, 1),

('Ruta Scott Speedster 20', 4800000,
'https://www.cykellagret.se/productfiles/images/2/28584b07-de61-41f1-ba81-2a181631e290_large.jpg',
'Equilibrada, cómoda y perfecta para entrenamientos largos.',
'Scott', 'ruta', 9, 1),

('Ruta Merida Scultura 200', 4500000,
'https://tedsbikeshop.com.au/wp-content/uploads/2021/08/SCULTURA_200_BLKSLV.png',
'Ligera y eficiente con transmisión Shimano Tiagra.',
'Merida', 'ruta', 6, 1),

-- 🌆 Urbanas
('Urbana Cannondale Quick 4', 2600000,
'https://d2yn9m4p3q9iyv.cloudfront.net/cannondale/2021/quick-4/thumbs/1000/2499c.webp',
'Bicicleta urbana rápida, ligera y cómoda.',
'Cannondale', 'urbana', 12, 1),

('Urbana Scott Sub Cross 40', 2500000,
'https://tse2.mm.bing.net/th/id/OIP.y4U1dgojM7VvWTprLz1sWwHaE5?cb=ucfimg2ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3',
'Urbana todoterreno para ciudad con postura ergonómica.',
'Scott', 'urbana', 10, 1),

('Urbana Merida Crossway 20', 2400000,
'https://tse1.mm.bing.net/th/id/OIP.j_BBR_hyft8AcyZ2O-ihXwHaET?cb=ucfimg2ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3',
'Cómoda, estable y perfecta para trayectos diarios.',
'Merida', 'urbana', 8, 1),

-- 🔀 Híbridas
('Híbrida Cannondale Quick CX 3', 2800000,
'https://tse3.mm.bing.net/th/id/OIP.GRRe9bFLOvxMMG-E6tinBAHaEo?cb=ucfimg2ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3',
'Híbrida versátil con suspensión delantera y frenos hidráulicos.',
'Cannondale', 'hibrida', 13, 1),

('Híbrida Scott Metrix 30', 2950000,
'https://content.bikeroar.com/system/product_variation/000/358/511/large/scott-metrix-30-disc-315808-1.png?1513878524',
'Ágil, rápida y perfecta para entrenamiento urbano.',
'Scott', 'hibrida', 9, 1),

('Híbrida Merida Speeder 200', 3000000,
'https://tse1.mm.bing.net/th/id/OIP.OkxRTsYBaVAATMf7zu58YwHaFj?cb=ucfimg2ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3',
'Combinación ideal entre velocidad y comodidad.',
'Merida', 'hibrida', 7, 1),

-- 🧒 Bicicletas Infantiles
('Infantil Trek Precaliber 20', 850000,
'https://th.bing.com/th/id/R.907c628153cbe3c9989198a8a5d96fdc?rik=KKgrsOwH9biQIw&pid=ImgRaw&r=0',
'Bicicleta segura y ligera para niños de 6 a 8 años.',
'Trek', 'infantil', 20, 1),

('Infantil Giant ARX 20', 900000,
'https://tse1.mm.bing.net/th/id/OIP.eDcuKeTRiev9_NSIukYvaQHaFS?cb=ucfimg2ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3',
'Cuadro liviano y diseño cómodo para niños.',
'Giant', 'infantil', 18, 1),

('Infantil Specialized Riprock 20', 1100000,
'https://tse3.mm.bing.net/th/id/OIP.KSPZ40MnwW5S0tBOQMDldwHaEK?cb=ucfimg2ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3',
'Ruedas anchas para mayor estabilidad y tracción.',
'Specialized', 'infantil', 14, 1),

-- ⚙️ Componentes
('Llantas Maxxis Ardent 29"', 190000,
'https://www.virtualllantas.com/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/l/l/llanta_maxxis_ardent_1_1_1_1_1_1_1_1.jpg',
'Llanta de alto agarre para MTB.',
'Maxxis', 'componente', 25, 1),

('Frenos Shimano MT200', 230000,
'https://th.bing.com/th/id/R.64b10a32e83688c88ea47f3efee1b9f3?rik=EO0h3PNUPtGqaQ&pid=ImgRaw&r=0',
'Juego de frenos hidráulicos confiables.',
'Shimano', 'componente', 18, 1),

('Transmisión SRAM SX Eagle 12v', 490000,
'https://http2.mlstatic.com/D_NQ_NP_859560-MLB46560010426_062021-O.webp',
'Transmisión moderna y eficiente para MTB.',
'SRAM', 'componente', 10, 1),

-- 🧰 Accesorios
('Casco Giro Fixture MIPS', 220000,
'https://epicbikes.com.ar/wp-content/uploads/2021/10/Giro_FixtureMips_MatteBlack_01.jpg',
'Casco seguro con tecnología MIPS.',
'Giro', 'accesorio', 30, 1),

('Luces LED Bontrager Ion 100', 95000,
'https://tse3.mm.bing.net/th/id/OIP.aT7xvA3nUj_EnqgHeMYyxgHaHa?cb=ucfimg2ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3',
'Set de luces recargables para mayor visibilidad.',
'Bontrager', 'accesorio', 40, 1),

('Guantes Specialized BG Sport', 75000,
'https://tse4.mm.bing.net/th/id/OIP.5M9ufWU9rbBFsuQ37HnauQHaHa?cb=ucfimg2ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3',
'Guantes cómodos con acolchado Body Geometry.',
'Specialized', 'accesorio', 35, 1);

-- =====================================================
-- 👤 INSERTAR USUARIO ADMIN
-- =====================================================
INSERT INTO usuario (nombres, apellidos, correo, clave, rol, direccion, telefono)
VALUES (
    'Bryan David',
    'López Campos',
    'admin@bikestore.com',
    '$2a$10$Vy7Y8kDTmZopYI6J2sHc7uQMvV2r6VaD2bKzEfHo0Ych7O3vV1LzW', -- admin123
    'Administrador',
    'Calle 123 #45-67',
    '3001234567'
);

