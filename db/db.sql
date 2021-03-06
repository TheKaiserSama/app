CREATE TABLE actividad (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL,
    descripcion TEXT DEFAULT '',
    porcentaje NUMERIC(5, 2) NOT NULL,
    id_logro INTEGER NOT NULL
);

CREATE TABLE anio_lectivo (
    id SERIAL PRIMARY KEY,
    descripcion TEXT NOT NULL,
    anio_actual INTEGER NOT NULL,
    vigente BOOLEAN NOT NULL DEFAULT TRUE,
    id_estado_anio_lectivo INTEGER NOT NULL,
    id_rango INTEGER NOT NULL
);

CREATE TABLE area (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL UNIQUE,
    descripcion TEXT DEFAULT ''
);

CREATE TABLE boletin (
    id SERIAL PRIMARY KEY,
    observaciones TEXT,
    rector TEXT NOT NULL,
    coordinador TEXT NOT NULL,
    id_curso INTEGER,
    id_anio_lectivo INTEGER,
    id_periodo INTEGER,
    id_director_grupo INTEGER,
    id_estudiante INTEGER
);

CREATE TABLE consolidado (
    id SERIAL PRIMARY KEY,
    observaciones TEXT,
    rector TEXT NOT NULL,
    coordinador TEXT NOT NULL,
    id_anio_lectivo INTEGER,
    id_curso INTEGER,
    id_director_grupo INTEGER,
    id_periodo INTEGER
);

CREATE TABLE consolidado_estudiante (
    id SERIAL PRIMARY KEY,
    observaciones TEXT,
    id_consolidado INTEGER,
    id_estudiante INTEGER
);

CREATE TABLE curso (
    id SERIAL PRIMARY KEY,
    id_sede INTEGER NOT NULL,
    id_anio_lectivo INTEGER NOT NULL,
    id_jornada INTEGER NOT NULL,
    id_grado INTEGER NOT NULL,
    id_grupo INTEGER NOT NULL,
    cupo_maximo INTEGER NOT NULL,
    cupo_utilizado INTEGER DEFAULT 0
);

CREATE TABLE departamento (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL UNIQUE,
    descripcion TEXT DEFAULT ''
);

CREATE TABLE director_grupo (
    id SERIAL PRIMARY KEY,
    id_anio_lectivo INTEGER NOT NULL,
    id_docente INTEGER NOT NULL,
    id_curso INTEGER NOT NULL
);

CREATE TABLE docente (
    id SERIAL PRIMARY KEY,
    titulo TEXT NOT NULL,
    fecha_registro DATE DEFAULT CURRENT_DATE,
    fecha_ingreso DATE,
    vigente BOOLEAN NOT NULL DEFAULT TRUE,
    codigo TEXT NOT NULL,
    id_estado_docente INTEGER NOT NULL,
    id_persona INTEGER NOT NULL
);

CREATE TABLE estado_anio_lectivo (
    id SERIAL PRIMARY KEY,
    descripcion TEXT NOT NULL UNIQUE
);

CREATE TABLE estado_docente (
    id SERIAL PRIMARY KEY,
    descripcion TEXT NOT NULL UNIQUE
);

CREATE TABLE estado_estudiante (
    id SERIAL PRIMARY KEY,
    descripcion TEXT NOT NULL UNIQUE
);

CREATE TABLE estado_matricula (
    id SERIAL PRIMARY KEY,
    descripcion TEXT NOT NULL UNIQUE
);

CREATE TABLE estudiante (
    id SERIAL PRIMARY KEY,
    fecha_registro DATE DEFAULT CURRENT_DATE,
    fecha_ingreso DATE,
    vigente BOOLEAN NOT NULL DEFAULT TRUE,  
    codigo TEXT NOT NULL UNIQUE,
    id_estado_estudiante INTEGER NOT NULL,
    id_persona INTEGER NOT NULL,
    id_acudiente INTEGER NOT NULL
);

CREATE TABLE estudiante_actividad (
    id SERIAL PRIMARY KEY,
    nota NUMERIC(3, 2) NOT NULL,
    id_actividad INTEGER NOT NULL,
    id_estudiante INTEGER NOT NULL
);

CREATE TABLE estudiante_logro (
    id SERIAL PRIMARY KEY,
    nota NUMERIC(3, 2) NOT NULL,
    id_logro INTEGER NOT NULL,
    id_estudiante INTEGER NOT NULL
);

CREATE TABLE grado (
    id SERIAL PRIMARY KEY,
    grado INTEGER NOT NULL UNIQUE,
    vigente BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE grado_materia (
    id SERIAL PRIMARY KEY,
    vigente BOOLEAN NOT NULL DEFAULT TRUE,
    id_anio_lectivo INTEGER NOT NULL,
    id_grado INTEGER NOT NULL,
    id_materia INTEGER NOT NULL
);

CREATE TABLE grupo (
    id SERIAL PRIMARY KEY,
    descripcion TEXT NOT NULL UNIQUE, 
    vigente BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE inasistencia (
    id SERIAL PRIMARY KEY,
    vigente BOOLEAN NOT NULL DEFAULT TRUE,
    fecha TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    justificado BOOLEAN DEFAULT FALSE,
    id_estudiante INTEGER NOT NULL,
    id_plan_docente INTEGER NOT NULL
);

CREATE TABLE institucion (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL UNIQUE,
    descripcion TEXT DEFAULT '',
    mision TEXT DEFAULT '',
    vision TEXT DEFAULT '',
    himno TEXT DEFAULT '',
    lema TEXT DEFAULT ''
);

CREATE TABLE jornada (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL UNIQUE,
    descripcion TEXT DEFAULT ''
);

CREATE TABLE logro (
    id SERIAL PRIMARY KEY,
    descripcion TEXT NOT NULL,
    porcentaje NUMERIC(5, 2) NOT NULL,
    vigente BOOLEAN DEFAULT TRUE,
    id_plan_docente INTEGER NOT NULL
);

CREATE TABLE materia (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL UNIQUE,
    descripcion TEXT DEFAULT '',
    vigente BOOLEAN NOT NULL DEFAULT TRUE,
    id_area INTEGER NOT NULL
);

CREATE TABLE matricula (
    id SERIAL PRIMARY KEY,
    fecha_registro DATE DEFAULT CURRENT_DATE,
    vigente BOOLEAN DEFAULT TRUE,
    id_estado_matricula INTEGER NOT NULL,
    id_estudiante INTEGER NOT NULL,
    id_anio_lectivo INTEGER NOT NULL,
    id_curso INTEGER NOT NULL
);

CREATE TABLE municipio (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL,
    descripcion TEXT DEFAULT '',
    id_departamento INTEGER NOT NULL
);

CREATE TABLE notificacion (
    id SERIAL PRIMARY KEY,
    mensaje TEXT NOT NULL,
    fecha TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    vigente BOOLEAN DEFAULT TRUE,
    visto BOOLEAN DEFAULT FALSE,
    id_tipo_notificacion INTEGER NOT NULL,
    id_estudiante INTEGER NOT NULL,
    id_plan_docente INTEGER NOT NULL,
    id_actividad INTEGER
);

CREATE TABLE periodo (
    id SERIAL PRIMARY KEY,
    numero INTEGER NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_finalizacion DATE NOT NULL,
    descripcion TEXT DEFAULT '',
    id_anio_lectivo INTEGER NOT NULL
);

CREATE TABLE persona (
    id SERIAL PRIMARY KEY,
    documento TEXT NOT NULL UNIQUE,
    primer_nombre TEXT NOT NULL,
    segundo_nombre TEXT,
    primer_apellido TEXT NOT NULL,
    segundo_apellido TEXT NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    numero_telefono TEXT DEFAULT '',
    numero_celular TEXT DEFAULT '',
    direccion TEXT NOT NULL,
    id_rol INTEGER NOT NULL,
    id_tipo_documento INTEGER NOT NULL,
    id_municipio INTEGER NOT NULL,
    id_sexo INTEGER NOT NULL
);

CREATE TABLE plan_docente (
    id SERIAL PRIMARY KEY,
    fecha_registro DATE DEFAULT CURRENT_DATE,
    fecha_ingreso DATE,
    vigente BOOLEAN DEFAULT TRUE,
    id_materia INTEGER NOT NULL,
    id_periodo INTEGER NOT NULL,
    id_anio_lectivo INTEGER NOT NULL,
    id_curso INTEGER NOT NULL,
    id_sede INTEGER NOT NULL,
    id_docente INTEGER NOT NULL
);

CREATE TABLE plan_estudiante (
    id SERIAL PRIMARY KEY,
    fecha_registro DATE DEFAULT CURRENT_DATE,
    id_plan_docente INTEGER NOT NULL,
    id_estudiante INTEGER NOT NULL
);

CREATE TABLE rango (
    id SERIAL PRIMARY KEY,
    descripcion TEXT DEFAULT '',
    minimo INTEGER NOT NULL,
    maximo INTEGER NOT NULL
);

CREATE TABLE rol (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL UNIQUE,
    descripcion TEXT DEFAULT ''
);

CREATE TABLE sede (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL UNIQUE,
    descripcion TEXT DEFAULT '',
    direccion TEXT NOT NULL,
    telefono TEXT NOT NULL,
    id_institucion INTEGER NOT NULL
);

CREATE TABLE sexo (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL UNIQUE,
    descripcion TEXT DEFAULT ''
);

CREATE TABLE tipo_documento (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL UNIQUE,
    descripcion TEXT DEFAULT ''
);

CREATE TABLE tipo_notificacion (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL UNIQUE,
    descripcion TEXT DEFAULT ''
);

CREATE TABLE usuario (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    ultima_sesion TIMESTAMP WITH TIME ZONE,
    fecha_creacion DATE DEFAULT CURRENT_DATE,
    id_rol INTEGER NOT NULL,
    id_persona INTEGER NOT NULL
);

CREATE TABLE valoracion_cualitativa (
    id SERIAL PRIMARY KEY,
    nunca BOOLEAN DEFAULT FALSE,
    a_veces BOOLEAN DEFAULT FALSE,
    siempre BOOLEAN DEFAULT FALSE,
    id_valoracion_formativa INTEGER,
    id_boletin INTEGER
);

CREATE TABLE valoracion_formativa (
    id SERIAL PRIMARY KEY,
    descripcion TEXT NOT NULL,
    vigente BOOLEAN NOT NULL DEFAULT FALSE
);

ALTER TABLE actividad ADD CONSTRAINT actividad_id_logro_fkey FOREIGN KEY (id_logro) REFERENCES logro(id);

ALTER TABLE anio_lectivo ADD CONSTRAINT anio_lectivo_id_estado_anio_lectivo_fkey FOREIGN KEY (id_estado_anio_lectivo) REFERENCES estado_anio_lectivo(id);
ALTER TABLE anio_lectivo ADD CONSTRAINT anio_lectivo_id_rango_fkey FOREIGN KEY (id_rango) REFERENCES rango(id);

ALTER TABLE boletin ADD CONSTRAINT boletin_id_anio_lectivo_fkey FOREIGN KEY (id_anio_lectivo) REFERENCES anio_lectivo(id);
ALTER TABLE boletin ADD CONSTRAINT boletin_id_curso_fkey FOREIGN KEY (id_curso) REFERENCES curso(id);
ALTER TABLE boletin ADD CONSTRAINT boletin_id_director_grupo_fkey FOREIGN KEY (id_director_grupo) REFERENCES director_grupo(id);
ALTER TABLE boletin ADD CONSTRAINT boletin_id_estudiante_fkey FOREIGN KEY (id_estudiante) REFERENCES estudiante(id);
ALTER TABLE boletin ADD CONSTRAINT boletin_id_periodo_fkey FOREIGN KEY (id_periodo) REFERENCES periodo(id);

ALTER TABLE consolidado ADD CONSTRAINT consolidado_id_anio_lectivo_fkey FOREIGN KEY (id_anio_lectivo) REFERENCES anio_lectivo(id);
ALTER TABLE consolidado ADD CONSTRAINT consolidado_id_curso_fkey FOREIGN KEY (id_curso) REFERENCES curso(id);
ALTER TABLE consolidado ADD CONSTRAINT consolidado_id_director_grupo_fkey FOREIGN KEY (id_director_grupo) REFERENCES director_grupo(id);
ALTER TABLE consolidado ADD CONSTRAINT consolidado_id_periodo_fkey FOREIGN KEY (id_periodo) REFERENCES periodo(id);

ALTER TABLE consolidado_estudiante ADD CONSTRAINT consolidado_estudiante_id_consolidado_fkey FOREIGN KEY (id_consolidado) REFERENCES consolidado(id);
ALTER TABLE consolidado_estudiante ADD CONSTRAINT consolidado_estudiante_id_estudiante_fkey FOREIGN KEY (id_estudiante) REFERENCES estudiante(id);

ALTER TABLE curso ADD CONSTRAINT curso_id_anio_lectivo_fkey FOREIGN KEY (id_anio_lectivo) REFERENCES anio_lectivo(id);
ALTER TABLE curso ADD CONSTRAINT curso_id_grado_fkey FOREIGN KEY (id_grado) REFERENCES grado(id);
ALTER TABLE curso ADD CONSTRAINT curso_id_grupo_fkey FOREIGN KEY (id_grupo) REFERENCES grupo(id);
ALTER TABLE curso ADD CONSTRAINT curso_id_jornada_fkey FOREIGN KEY (id_jornada) REFERENCES jornada(id);
ALTER TABLE curso ADD CONSTRAINT curso_id_sede_fkey FOREIGN KEY (id_sede) REFERENCES sede(id);

ALTER TABLE director_grupo ADD CONSTRAINT director_grupo_id_anio_lectivo_fkey FOREIGN KEY (id_anio_lectivo) REFERENCES anio_lectivo(id);
ALTER TABLE director_grupo ADD CONSTRAINT director_grupo_id_curso_fkey FOREIGN KEY (id_curso) REFERENCES curso(id);
ALTER TABLE director_grupo ADD CONSTRAINT director_grupo_id_docente_fkey FOREIGN KEY (id_docente) REFERENCES docente(id);

ALTER TABLE docente ADD CONSTRAINT docente_id_estado_docente_fkey FOREIGN KEY (id_estado_docente) REFERENCES estado_docente(id);
ALTER TABLE docente ADD CONSTRAINT docente_id_persona_fkey FOREIGN KEY (id_persona) REFERENCES persona(id);

ALTER TABLE estudiante ADD CONSTRAINT estudiante_id_estado_estudiante_fkey FOREIGN KEY (id_estado_estudiante) REFERENCES estado_estudiante(id);
ALTER TABLE estudiante ADD CONSTRAINT estudiante_id_persona_fkey FOREIGN KEY (id_persona) REFERENCES persona(id);

ALTER TABLE estudiante_actividad ADD CONSTRAINT estudiante_actividad_id_actividad_fkey FOREIGN KEY (id_actividad) REFERENCES actividad(id);
ALTER TABLE estudiante_actividad ADD CONSTRAINT estudiante_actividad_id_estudiante_fkey FOREIGN KEY (id_estudiante) REFERENCES estudiante(id);

ALTER TABLE estudiante_logro ADD CONSTRAINT estudiante_logro_id_estudiante_fkey FOREIGN KEY (id_estudiante) REFERENCES estudiante(id);
ALTER TABLE estudiante_logro ADD CONSTRAINT estudiante_logro_id_logro_fkey FOREIGN KEY (id_logro) REFERENCES logro(id);

ALTER TABLE grado_materia ADD CONSTRAINT grado_materia_id_anio_lectivo_fkey FOREIGN KEY (id_anio_lectivo) REFERENCES anio_lectivo(id);
ALTER TABLE grado_materia ADD CONSTRAINT grado_materia_id_grado_fkey FOREIGN KEY (id_grado) REFERENCES grado(id);
ALTER TABLE grado_materia ADD CONSTRAINT grado_materia_id_materia_fkey FOREIGN KEY (id_materia) REFERENCES materia(id);

ALTER TABLE inasistencia ADD CONSTRAINT inasistencia_id_estudiante_fkey FOREIGN KEY (id_estudiante) REFERENCES estudiante(id);
ALTER TABLE inasistencia ADD CONSTRAINT inasistencia_id_plan_docente_fkey FOREIGN KEY (id_plan_docente) REFERENCES plan_docente(id);

ALTER TABLE logro ADD CONSTRAINT logro_id_plan_docente_fkey FOREIGN KEY (id_plan_docente) REFERENCES plan_docente(id);

ALTER TABLE materia ADD CONSTRAINT materia_id_area_fkey FOREIGN KEY (id_area) REFERENCES area(id);

ALTER TABLE matricula ADD CONSTRAINT matricula_id_anio_lectivo_fkey FOREIGN KEY (id_anio_lectivo) REFERENCES anio_lectivo(id);
ALTER TABLE matricula ADD CONSTRAINT matricula_id_curso_fkey FOREIGN KEY (id_curso) REFERENCES curso(id);
ALTER TABLE matricula ADD CONSTRAINT matricula_id_estado_matricula_fkey FOREIGN KEY (id_estado_matricula) REFERENCES estado_matricula(id);
ALTER TABLE matricula ADD CONSTRAINT matricula_id_estudiante_fkey FOREIGN KEY (id_estudiante) REFERENCES estudiante(id);

ALTER TABLE municipio ADD CONSTRAINT municipio_id_departamento_fkey FOREIGN KEY (id_departamento) REFERENCES departamento(id);

ALTER TABLE notificacion ADD CONSTRAINT notificacion_id_actividad_fkey FOREIGN KEY (id_actividad) REFERENCES actividad(id);
ALTER TABLE notificacion ADD CONSTRAINT notificacion_id_estudiante_fkey FOREIGN KEY (id_estudiante) REFERENCES estudiante(id);
ALTER TABLE notificacion ADD CONSTRAINT notificacion_id_plan_docente_fkey FOREIGN KEY (id_plan_docente) REFERENCES plan_docente(id);
ALTER TABLE notificacion ADD CONSTRAINT notificacion_id_tipo_notificacion_fkey FOREIGN KEY (id_tipo_notificacion) REFERENCES tipo_notificacion(id);

ALTER TABLE periodo ADD CONSTRAINT periodo_id_anio_lectivo_fkey FOREIGN KEY (id_anio_lectivo) REFERENCES anio_lectivo(id);

ALTER TABLE persona ADD CONSTRAINT persona_id_municipio_fkey FOREIGN KEY (id_municipio) REFERENCES municipio(id);
ALTER TABLE persona ADD CONSTRAINT persona_id_rol_fkey FOREIGN KEY (id_rol) REFERENCES rol(id);
ALTER TABLE persona ADD CONSTRAINT persona_id_sexo_fkey FOREIGN KEY (id_sexo) REFERENCES sexo(id);
ALTER TABLE persona ADD CONSTRAINT persona_id_tipo_documento_fkey FOREIGN KEY (id_tipo_documento) REFERENCES tipo_documento(id);

ALTER TABLE plan_docente ADD CONSTRAINT plan_docente_id_anio_lectivo_fkey FOREIGN KEY (id_anio_lectivo) REFERENCES anio_lectivo(id);
ALTER TABLE plan_docente ADD CONSTRAINT plan_docente_id_curso_fkey FOREIGN KEY (id_curso) REFERENCES curso(id);
ALTER TABLE plan_docente ADD CONSTRAINT plan_docente_id_docente_fkey FOREIGN KEY (id_docente) REFERENCES docente(id);
ALTER TABLE plan_docente ADD CONSTRAINT plan_docente_id_materia_fkey FOREIGN KEY (id_materia) REFERENCES materia(id);
ALTER TABLE plan_docente ADD CONSTRAINT plan_docente_id_periodo_fkey FOREIGN KEY (id_periodo) REFERENCES periodo(id);
ALTER TABLE plan_docente ADD CONSTRAINT plan_docente_id_sede_fkey FOREIGN KEY (id_sede) REFERENCES sede(id);

ALTER TABLE plan_estudiante ADD CONSTRAINT plan_estudiante_id_estudiante_fkey FOREIGN KEY (id_estudiante) REFERENCES estudiante(id);
ALTER TABLE plan_estudiante ADD CONSTRAINT plan_estudiante_id_plan_docente_fkey FOREIGN KEY (id_plan_docente) REFERENCES plan_docente(id);

ALTER TABLE sede ADD CONSTRAINT sede_id_institucion_fkey FOREIGN KEY (id_institucion) REFERENCES institucion(id);

ALTER TABLE usuario ADD CONSTRAINT usuario_id_persona_fkey FOREIGN KEY (id_persona) REFERENCES persona(id);
ALTER TABLE usuario ADD CONSTRAINT usuario_id_rol_fkey FOREIGN KEY (id_rol) REFERENCES rol(id);

ALTER TABLE valoracion_cualitativa ADD CONSTRAINT valoracion_cualitativa_id_boletin_fkey FOREIGN KEY (id_boletin) REFERENCES boletin(id);
ALTER TABLE valoracion_cualitativa ADD CONSTRAINT valoracion_cualitativa_id_valoracion_formativa_fkey FOREIGN KEY (id_valoracion_formativa) REFERENCES valoracion_formativa(id);

-- INSERT TIPO DE DOCUMENTO
INSERT INTO tipo_documento (id, nombre, descripcion)
VALUES
	(1, 'Registro Civil', ''),
	(2, 'Tarjeta de identidad', ''),
	(3, 'C??dula de ciudadan??a', ''),
	(4, 'C??dula de extranjer??a', '');

-- INSERT TIPO DE NOTIFICACION
INSERT INTO tipo_notificacion (id, nombre, descripcion)
VALUES
	(1, 'Informativa', '');

-- INSERT GRADO
INSERT INTO grado (id, grado, vigente)
VALUES
	(1, 1, true),
	(2, 2, true),
	(3, 3, true),
	(4, 4, true),
	(5, 5, true),
	(6, 6, true),
	(7, 7, true),
	(8, 8, true),
	(9, 9, true),
	(10, 10, true),
	(11, 11, true),
	(12, 0, true);

-- INSERT GRUPO
INSERT INTO grupo (id, descripcion)
VALUES
	(1, '1'),
	(2, '2'),
	(3, '3');

-- INSERT ESTADO MATRICULA
INSERT INTO estado_matricula (id, descripcion)
VALUES
    (1, 'Matriculado'),
    (2, 'No matriculado');

-- INSERT ESTADO ESTUDIANTE
INSERT INTO estado_estudiante (id, descripcion)
VALUES
	(1, 'Regular'),
    (2, 'Incapacidad'),
	(3, 'Suspenci??n'),
	(4, 'Retiro'),
	(5, 'Otro');

-- INSERT ESTADO DOCENTE
INSERT INTO estado_docente (id, descripcion)
VALUES
	(1, 'Regular'),
    (2, 'Vacaciones'),
    (3, 'Incapacidad'),
	(4, 'Retiro'),
	(5, 'Otro');

-- INSERT ESTADO ANIO LECTIVO
INSERT INTO estado_anio_lectivo (id, descripcion)
VALUES
    (1, 'Activo'),
    (2, 'Inactivo');

-- INSERT RANGO
INSERT INTO rango (id, descripcion, minimo, maximo)
VALUES
    (1, 'Sistema de calificai??n numerico', 0, 5);

-- INSERT SEXO
INSERT INTO sexo (id, nombre)
VALUES
	(1, 'Masculino'),
	(2, 'Femenino');

-- INSERT JORNADA
INSERT INTO jornada (id, nombre)
VALUES
	(1, 'Ma??ana'),
	(2, 'Tarde'),
	(3, 'Noche');

-- INSERT INSTITUCION	
INSERT INTO institucion (id, nombre, descripcion, mision, vision, himno, lema)
VALUES (
	1,
	'Instituci??n Educativa Integrada de Chilvi',
	'Alguna descripci??n',
	'Misi??n para la Instituci??n Educativa Integrada de Chilvi',
	'Visi??n para la Instituci??n Educativa Integrada de Chilvi',
	'Himno para la Instituci??n Educativa Integrada de Chilvi',
	'Lema para la Instituci??n Educativa Integrada de Chilvi'
);

-- INSERT SEDE
INSERT INTO sede (id, nombre, descripcion, direccion, telefono, id_institucion)
VALUES
	(1, 'SEDE #1', 'Sede principal', 'Kilometro - 21', '7271245', 1),
	(2, 'SEDE #2', 'Sede secundaria', 'Kilometro - 22', '7270278', 1);

-- INSERT A??O LECTIVO
INSERT INTO anio_lectivo (id, descripcion, anio_actual, id_estado_anio_lectivo, id_rango)
VALUES
	(1, 'A??o lectivo para el periodo 2020', 2020, 1, 1),
	(2, 'A??o lectivo para el periodo 2021', 2021, 1, 1);

-- INSERT ROL
INSERT INTO rol (id, nombre, descripcion)
VALUES
	(1, 'Administrador', ''),
    (2, 'Docente', ''),
    (3, 'Estudiante', ''),
    (4, 'Otro', '');

-- INSERT DEPARTAMENTOS
INSERT INTO departamento (id, nombre)
VALUES
	(5,'ANTIOQUIA'),
	(8,'ATL??NTICO'),
	(11,'BOGOT??, D.C.'),
	(13,'BOL??VAR'),
	(15,'BOYAC??'),
	(17,'CALDAS'),
	(18,'CAQUET??'),
	(19,'CAUCA'),
	(20,'CESAR'),
	(23,'C??RDOBA'),
	(25,'CUNDINAMARCA'),
	(27,'CHOC??'),
	(41,'HUILA'),
	(44,'LA GUAJIRA'),
	(47,'MAGDALENA'),
	(50,'META'),
	(52,'NARI??O'),
	(54,'NORTE DE SANTANDER'),
	(63,'QUINDIO'),
	(66,'RISARALDA'),
	(68,'SANTANDER'),
	(70,'SUCRE'),
	(73,'TOLIMA'),
	(76,'VALLE DEL CAUCA'),
	(81,'ARAUCA'),
	(85,'CASANARE'),
	(86,'PUTUMAYO'),
	(88,'ARCHIPI??LAGO DE SAN ANDR??S, PROVIDENCIA Y SANTA CATALINA'),
	(91,'AMAZONAS'),
	(94,'GUAIN??A'),
	(95,'GUAVIARE'),
	(97,'VAUP??S'),
	(99,'VICHADA');

-- INSERT MUNICIPIOS
INSERT INTO municipio (id, nombre, id_departamento)
VALUES
	(1,'Abriaqu??',5),
	(2,'Acac??as',50),
	(3,'Acand??',27),
	(4,'Acevedo',41),
	(5,'Ach??',13),
	(6,'Agrado',41),
	(7,'Agua de Dios',25),
	(8,'Aguachica',20),
	(9,'Aguada',68),
	(10,'Aguadas',17),
	(11,'Aguazul',85),
	(12,'Agust??n Codazzi',20),
	(13,'Aipe',41),
	(14,'Albania',18),
	(15,'Albania',44),
	(16,'Albania',68),
	(17,'Alb??n',25),
	(18,'Alb??n (San Jos??)',52),
	(19,'Alcal??',76),
	(20,'Alejandria',5),
	(21,'Algarrobo',47),
	(22,'Algeciras',41),
	(23,'Almaguer',19),
	(24,'Almeida',15),
	(25,'Alpujarra',73),
	(26,'Altamira',41),
	(27,'Alto Baud?? (Pie de Pato)',27),
	(28,'Altos del Rosario',13),
	(29,'Alvarado',73),
	(30,'Amag??',5),
	(31,'Amalfi',5),
	(32,'Ambalema',73),
	(33,'Anapoima',25),
	(34,'Ancuya',52),
	(35,'Andaluc??a',76),
	(36,'Andes',5),
	(37,'Angel??polis',5),
	(38,'Angostura',5),
	(39,'Anolaima',25),
	(40,'Anor??',5),
	(41,'Anserma',17),
	(42,'Ansermanuevo',76),
	(43,'Anzo??tegui',73),
	(44,'Anz??',5),
	(45,'Apartad??',5),
	(46,'Apulo',25),
	(47,'Ap??a',66),
	(48,'Aquitania',15),
	(49,'Aracataca',47),
	(50,'Aranzazu',17),
	(51,'Aratoca',68),
	(52,'Arauca',81),
	(53,'Arauquita',81),
	(54,'Arbel??ez',25),
	(55,'Arboleda (Berruecos)',52),
	(56,'Arboledas',54),
	(57,'Arboletes',5),
	(58,'Arcabuco',15),
	(59,'Arenal',13),
	(60,'Argelia',5),
	(61,'Argelia',19),
	(62,'Argelia',76),
	(63,'Ariguan?? (El Dif??cil)',47),
	(64,'Arjona',13),
	(65,'Armenia',5),
	(66,'Armenia',63),
	(67,'Armero (Guayabal)',73),
	(68,'Arroyohondo',13),
	(69,'Astrea',20),
	(70,'Ataco',73),
	(71,'Atrato (Yuto)',27),
	(72,'Ayapel',23),
	(73,'Bagad??',27),
	(74,'Bah??a Solano (M??tis)',27),
	(75,'Bajo Baud?? (Pizarro)',27),
	(76,'Balboa',19),
	(77,'Balboa',66),
	(78,'Baranoa',8),
	(79,'Baraya',41),
	(80,'Barbacoas',52),
	(81,'Barbosa',5),
	(82,'Barbosa',68),
	(83,'Barichara',68),
	(84,'Barranca de Up??a',50),
	(85,'Barrancabermeja',68),
	(86,'Barrancas',44),
	(87,'Barranco de Loba',13),
	(88,'Barranquilla',8),
	(89,'Becerr??l',20),
	(90,'Belalc??zar',17),
	(91,'Bello',5),
	(92,'Belmira',5),
	(93,'Beltr??n',25),
	(94,'Bel??n',15),
	(95,'Bel??n',52),
	(96,'Bel??n de Bajir??',27),
	(97,'Bel??n de Umbr??a',66),
	(98,'Bel??n de los Andaqu??es',18),
	(99,'Berbeo',15),
	(100,'Betania',5),
	(101,'Beteitiva',15),
	(102,'Betulia',5),
	(103,'Betulia',68),
	(104,'Bituima',25),
	(105,'Boavita',15),
	(106,'Bochalema',54),
	(107,'Bogot?? D.C.',11),
	(108,'Bojac??',25),
	(109,'Bojay?? (Bellavista)',27),
	(110,'Bol??var',5),
	(111,'Bol??var',19),
	(112,'Bol??var',68),
	(113,'Bol??var',76),
	(114,'Bosconia',20),
	(115,'Boyac??',15),
	(116,'Brice??o',5),
	(117,'Brice??o',15),
	(118,'Bucaramanga',68),
	(119,'Bucarasica',54),
	(120,'Buenaventura',76),
	(121,'Buenavista',15),
	(122,'Buenavista',23),
	(123,'Buenavista',63),
	(124,'Buenavista',70),
	(125,'Buenos Aires',19),
	(126,'Buesaco',52),
	(127,'Buga',76),
	(128,'Bugalagrande',76),
	(129,'Bur??tica',5),
	(130,'Busbanza',15),
	(131,'Cabrera',25),
	(132,'Cabrera',68),
	(133,'Cabuyaro',50),
	(134,'Cachipay',25),
	(135,'Caicedo',5),
	(136,'Caicedonia',76),
	(137,'Caimito',70),
	(138,'Cajamarca',73),
	(139,'Cajib??o',19),
	(140,'Cajic??',25),
	(141,'Calamar',13),
	(142,'Calamar',95),
	(143,'Calarc??',63),
	(144,'Caldas',5),
	(145,'Caldas',15),
	(146,'Caldono',19),
	(147,'California',68),
	(148,'Calima (Dari??n)',76),
	(149,'Caloto',19),
	(150,'Cal??',76),
	(151,'Campamento',5),
	(152,'Campo de la Cruz',8),
	(153,'Campoalegre',41),
	(154,'Campohermoso',15),
	(155,'Canalete',23),
	(156,'Candelaria',8),
	(157,'Candelaria',76),
	(158,'Cantagallo',13),
	(159,'Cant??n de San Pablo',27),
	(160,'Caparrap??',25),
	(161,'Capitanejo',68),
	(162,'Caracol??',5),
	(163,'Caramanta',5),
	(164,'Carcas??',68),
	(165,'Carepa',5),
	(166,'Carmen de Apical??',73),
	(167,'Carmen de Carupa',25),
	(168,'Carmen de Viboral',5),
	(169,'Carmen del Dari??n (CURBARAD??)',27),
	(170,'Carolina',5),
	(171,'Cartagena',13),
	(172,'Cartagena del Chair??',18),
	(173,'Cartago',76),
	(174,'Carur??',97),
	(175,'Casabianca',73),
	(176,'Castilla la Nueva',50),
	(177,'Caucasia',5),
	(178,'Ca??asgordas',5),
	(179,'Cepita',68),
	(180,'Ceret??',23),
	(181,'Cerinza',15),
	(182,'Cerrito',68),
	(183,'Cerro San Antonio',47),
	(184,'Chachagu??',52),
	(185,'Chaguan??',25),
	(186,'Chal??n',70),
	(187,'Chaparral',73),
	(188,'Charal??',68),
	(189,'Charta',68),
	(190,'Chigorod??',5),
	(191,'Chima',68),
	(192,'Chimichagua',20),
	(193,'Chim??',23),
	(194,'Chinavita',15),
	(195,'Chinchin??',17),
	(196,'Chin??cota',54),
	(197,'Chin??',23),
	(198,'Chipaque',25),
	(199,'Chipat??',68),
	(200,'Chiquinquir??',15),
	(201,'Chiriguan??',20),
	(202,'Chiscas',15),
	(203,'Chita',15),
	(204,'Chitag??',54),
	(205,'Chitaraque',15),
	(206,'Chivat??',15),
	(207,'Chivolo',47),
	(208,'Choach??',25),
	(209,'Chocont??',25),
	(210,'Ch??meza',85),
	(211,'Ch??a',25),
	(212,'Ch??quiza',15),
	(213,'Ch??vor',15),
	(214,'Cicuco',13),
	(215,'Cimitarra',68),
	(216,'Circasia',63),
	(217,'Cisneros',5),
	(218,'Ci??naga',15),
	(219,'Ci??naga',47),
	(220,'Ci??naga de Oro',23),
	(221,'Clemencia',13),
	(222,'Cocorn??',5),
	(223,'Coello',73),
	(224,'Cogua',25),
	(225,'Colombia',41),
	(226,'Colos?? (Ricaurte)',70),
	(227,'Col??n',86),
	(228,'Col??n (G??nova)',52),
	(229,'Concepci??n',5),
	(230,'Concepci??n',68),
	(231,'Concordia',5),
	(232,'Concordia',47),
	(233,'Condoto',27),
	(234,'Confines',68),
	(235,'Consaca',52),
	(236,'Contadero',52),
	(237,'Contrataci??n',68),
	(238,'Convenci??n',54),
	(239,'Copacabana',5),
	(240,'Coper',15),
	(241,'Cordob??',63),
	(242,'Corinto',19),
	(243,'Coromoro',68),
	(244,'Corozal',70),
	(245,'Corrales',15),
	(246,'Cota',25),
	(247,'Cotorra',23),
	(248,'Covarach??a',15),
	(249,'Cove??as',70),
	(250,'Coyaima',73),
	(251,'Cravo Norte',81),
	(252,'Cuaspud (Carlosama)',52),
	(253,'Cubarral',50),
	(254,'Cubar??',15),
	(255,'Cucaita',15),
	(256,'Cucunub??',25),
	(257,'Cucutilla',54),
	(258,'Cuitiva',15),
	(259,'Cumaral',50),
	(260,'Cumaribo',99),
	(261,'Cumbal',52),
	(262,'Cumbitara',52),
	(263,'Cunday',73),
	(264,'Curillo',18),
	(265,'Curit??',68),
	(266,'Curuman??',20),
	(267,'C??ceres',5),
	(268,'C??chira',54),
	(269,'C??cota',54),
	(270,'C??queza',25),
	(271,'C??rtegui',27),
	(272,'C??mbita',15),
	(273,'C??rdoba',13),
	(274,'C??rdoba',52),
	(275,'C??cuta',54),
	(276,'Dabeiba',5),
	(277,'Dagua',76),
	(278,'Dibulla',44),
	(279,'Distracci??n',44),
	(280,'Dolores',73),
	(281,'Don Mat??as',5),
	(282,'Dos Quebradas',66),
	(283,'Duitama',15),
	(284,'Durania',54),
	(285,'Eb??jico',5),
	(286,'El Bagre',5),
	(287,'El Banco',47),
	(288,'El Cairo',76),
	(289,'El Calvario',50),
	(290,'El Carmen',54),
	(291,'El Carmen',68),
	(292,'El Carmen de Atrato',27),
	(293,'El Carmen de Bol??var',13),
	(294,'El Castillo',50),
	(295,'El Cerrito',76),
	(296,'El Charco',52),
	(297,'El Cocuy',15),
	(298,'El Colegio',25),
	(299,'El Copey',20),
	(300,'El Doncello',18),
	(301,'El Dorado',50),
	(302,'El Dovio',76),
	(303,'El Espino',15),
	(304,'El Guacamayo',68),
	(305,'El Guamo',13),
	(306,'El Molino',44),
	(307,'El Paso',20),
	(308,'El Paujil',18),
	(309,'El Pe??ol',52),
	(310,'El Pe??on',13),
	(311,'El Pe??on',68),
	(312,'El Pe????n',25),
	(313,'El Pi??on',47),
	(314,'El Play??n',68),
	(315,'El Retorno',95),
	(316,'El Ret??n',47),
	(317,'El Roble',70),
	(318,'El Rosal',25),
	(319,'El Rosario',52),
	(320,'El Tabl??n de G??mez',52),
	(321,'El Tambo',19),
	(322,'El Tambo',52),
	(323,'El Tarra',54),
	(324,'El Zulia',54),
	(325,'El ??guila',76),
	(326,'El??as',41),
	(327,'Encino',68),
	(328,'Enciso',68),
	(329,'Entrerr??os',5),
	(330,'Envigado',5),
	(331,'Espinal',73),
	(332,'Facatativ??',25),
	(333,'Falan',73),
	(334,'Filadelfia',17),
	(335,'Filandia',63),
	(336,'Firavitoba',15),
	(337,'Flandes',73),
	(338,'Florencia',18),
	(339,'Florencia',19),
	(340,'Floresta',15),
	(341,'Florida',76),
	(342,'Floridablanca',68),
	(343,'Flori??n',68),
	(344,'Fonseca',44),
	(345,'Fort??l',81),
	(346,'Fosca',25),
	(347,'Francisco Pizarro',52),
	(348,'Fredonia',5),
	(349,'Fresno',73),
	(350,'Frontino',5),
	(351,'Fuente de Oro',50),
	(352,'Fundaci??n',47),
	(353,'Funes',52),
	(354,'Funza',25),
	(355,'Fusagasug??',25),
	(356,'F??meque',25),
	(357,'F??quene',25),
	(358,'Gachal??',25),
	(359,'Gachancip??',25),
	(360,'Gachantiv??',15),
	(361,'Gachet??',25),
	(362,'Galapa',8),
	(363,'Galeras (Nueva Granada)',70),
	(364,'Gal??n',68),
	(365,'Gama',25),
	(366,'Gamarra',20),
	(367,'Garagoa',15),
	(368,'Garz??n',41),
	(369,'Gigante',41),
	(370,'Ginebra',76),
	(371,'Giraldo',5),
	(372,'Girardot',25),
	(373,'Girardota',5),
	(374,'Gir??n',68),
	(375,'Gonzalez',20),
	(376,'Gramalote',54),
	(377,'Granada',5),
	(378,'Granada',25),
	(379,'Granada',50),
	(380,'Guaca',68),
	(381,'Guacamayas',15),
	(382,'Guacar??',76),
	(383,'Guachav??s',52),
	(384,'Guachen??',19),
	(385,'Guachet??',25),
	(386,'Guachucal',52),
	(387,'Guadalupe',5),
	(388,'Guadalupe',41),
	(389,'Guadalupe',68),
	(390,'Guaduas',25),
	(391,'Guaitarilla',52),
	(392,'Gualmat??n',52),
	(393,'Guamal',47),
	(394,'Guamal',50),
	(395,'Guamo',73),
	(396,'Guapota',68),
	(397,'Guap??',19),
	(398,'Guaranda',70),
	(399,'Guarne',5),
	(400,'Guasca',25),
	(401,'Guatap??',5),
	(402,'Guataqu??',25),
	(403,'Guatavita',25),
	(404,'Guateque',15),
	(405,'Guavat??',68),
	(406,'Guayabal de Siquima',25),
	(407,'Guayabetal',25),
	(408,'Guayat??',15),
	(409,'Guepsa',68),
	(410,'Guic??n',15),
	(411,'Guti??rrez',25),
	(412,'Gu??tica',66),
	(413,'G??mbita',68),
	(414,'G??meza',15),
	(415,'G??nova',63),
	(416,'G??mez Plata',5),
	(417,'Hacar??',54),
	(418,'Hatillo de Loba',13),
	(419,'Hato',68),
	(420,'Hato Corozal',85),
	(421,'Hatonuevo',44),
	(422,'Heliconia',5),
	(423,'Herr??n',54),
	(424,'Herveo',73),
	(425,'Hispania',5),
	(426,'Hobo',41),
	(427,'Honda',73),
	(428,'Ibagu??',73),
	(429,'Icononzo',73),
	(430,'Iles',52),
	(431,'Im??es',52),
	(432,'Inz??',19),
	(433,'In??rida',94),
	(434,'Ipiales',52),
	(435,'Isnos',41),
	(436,'Istmina',27),
	(437,'Itag????',5),
	(438,'Ituango',5),
	(439,'Iz??',15),
	(440,'Jambal??',19),
	(441,'Jamund??',76),
	(442,'Jard??n',5),
	(443,'Jenesano',15),
	(444,'Jeric??',5),
	(445,'Jeric??',15),
	(446,'Jerusal??n',25),
	(447,'Jes??s Mar??a',68),
	(448,'Jord??n',68),
	(449,'Juan de Acosta',8),
	(450,'Jun??n',25),
	(451,'Jurad??',27),
	(452,'La Apartada y La Frontera',23),
	(453,'La Argentina',41),
	(454,'La Belleza',68),
	(455,'La Calera',25),
	(456,'La Capilla',15),
	(457,'La Ceja',5),
	(458,'La Celia',66),
	(459,'La Cruz',52),
	(460,'La Cumbre',76),
	(461,'La Dorada',17),
	(462,'La Esperanza',54),
	(463,'La Estrella',5),
	(464,'La Florida',52),
	(465,'La Gloria',20),
	(466,'La Jagua de Ibirico',20),
	(467,'La Jagua del Pilar',44),
	(468,'La Llanada',52),
	(469,'La Macarena',50),
	(470,'La Merced',17),
	(471,'La Mesa',25),
	(472,'La Monta??ita',18),
	(473,'La Palma',25),
	(474,'La Paz',68),
	(475,'La Paz (Robles)',20),
	(476,'La Pe??a',25),
	(477,'La Pintada',5),
	(478,'La Plata',41),
	(479,'La Playa',54),
	(480,'La Primavera',99),
	(481,'La Salina',85),
	(482,'La Sierra',19),
	(483,'La Tebaida',63),
	(484,'La Tola',52),
	(485,'La Uni??n',5),
	(486,'La Uni??n',52),
	(487,'La Uni??n',70),
	(488,'La Uni??n',76),
	(489,'La Uvita',15),
	(490,'La Vega',19),
	(491,'La Vega',25),
	(492,'La Victoria',15),
	(493,'La Victoria',17),
	(494,'La Victoria',76),
	(495,'La Virginia',66),
	(496,'Labateca',54),
	(497,'Labranzagrande',15),
	(498,'Land??zuri',68),
	(499,'Lebrija',68),
	(500,'Leiva',52),
	(501,'Lejan??as',50),
	(502,'Lenguazaque',25),
	(503,'Leticia',91),
	(504,'Liborina',5),
	(505,'Linares',52),
	(506,'Llor??',27),
	(507,'Lorica',23),
	(508,'Los C??rdobas',23),
	(509,'Los Palmitos',70),
	(510,'Los Patios',54),
	(511,'Los Santos',68),
	(512,'Lourdes',54),
	(513,'Luruaco',8),
	(514,'L??rida',73),
	(515,'L??bano',73),
	(516,'L??pez (Micay)',19),
	(517,'Macanal',15),
	(518,'Macaravita',68),
	(519,'Maceo',5),
	(520,'Machet??',25),
	(521,'Madrid',25),
	(522,'Magangu??',13),
	(523,'Mag??i (Pay??n)',52),
	(524,'Mahates',13),
	(525,'Maicao',44),
	(526,'Majagual',70),
	(527,'Malambo',8),
	(528,'Mallama (Piedrancha)',52),
	(529,'Manat??',8),
	(530,'Manaure',44),
	(531,'Manaure Balc??n del Cesar',20),
	(532,'Manizales',17),
	(533,'Manta',25),
	(534,'Manzanares',17),
	(535,'Man??',85),
	(536,'Mapiripan',50),
	(537,'Margarita',13),
	(538,'Marinilla',5),
	(539,'Marip??',15),
	(540,'Mariquita',73),
	(541,'Marmato',17),
	(542,'Marquetalia',17),
	(543,'Marsella',66),
	(544,'Marulanda',17),
	(545,'Mar??a la Baja',13),
	(546,'Matanza',68),
	(547,'Medell??n',5),
	(548,'Medina',25),
	(549,'Medio Atrato',27),
	(550,'Medio Baud??',27),
	(551,'Medio San Juan (ANDAGOYA)',27),
	(552,'Melgar',73),
	(553,'Mercaderes',19),
	(554,'Mesetas',50),
	(555,'Mil??n',18),
	(556,'Miraflores',15),
	(557,'Miraflores',95),
	(558,'Miranda',19),
	(559,'Mistrat??',66),
	(560,'Mit??',97),
	(561,'Mocoa',86),
	(562,'Mogotes',68),
	(563,'Molagavita',68),
	(564,'Momil',23),
	(565,'Momp??s',13),
	(566,'Mongua',15),
	(567,'Mongu??',15),
	(568,'Moniquir??',15),
	(569,'Montebello',5),
	(570,'Montecristo',13),
	(571,'Montel??bano',23),
	(572,'Montenegro',63),
	(573,'Monteria',23),
	(574,'Monterrey',85),
	(575,'Morales',13),
	(576,'Morales',19),
	(577,'Morelia',18),
	(578,'Morroa',70),
	(579,'Mosquera',25),
	(580,'Mosquera',52),
	(581,'Motavita',15),
	(582,'Mo??itos',23),
	(583,'Murillo',73),
	(584,'Murind??',5),
	(585,'Mutat??',5),
	(586,'Mutiscua',54),
	(587,'Muzo',15),
	(588,'M??laga',68),
	(589,'Nari??o',5),
	(590,'Nari??o',25),
	(591,'Nari??o',52),
	(592,'Natagaima',73),
	(593,'Nech??',5),
	(594,'Necocl??',5),
	(595,'Neira',17),
	(596,'Neiva',41),
	(597,'Nemoc??n',25),
	(598,'Nilo',25),
	(599,'Nimaima',25),
	(600,'Nobsa',15),
	(601,'Nocaima',25),
	(602,'Norcasia',17),
	(603,'Noros??',13),
	(604,'Novita',27),
	(605,'Nueva Granada',47),
	(606,'Nuevo Col??n',15),
	(607,'Nunch??a',85),
	(608,'Nuqu??',27),
	(609,'N??taga',41),
	(610,'Obando',76),
	(611,'Ocamonte',68),
	(612,'Oca??a',54),
	(613,'Oiba',68),
	(614,'Oicat??',15),
	(615,'Olaya',5),
	(616,'Olaya Herrera',52),
	(617,'Onzaga',68),
	(618,'Oporapa',41),
	(619,'Orito',86),
	(620,'Orocu??',85),
	(621,'Ortega',73),
	(622,'Ospina',52),
	(623,'Otanche',15),
	(624,'Ovejas',70),
	(625,'Pachavita',15),
	(626,'Pacho',25),
	(627,'Padilla',19),
	(628,'Paicol',41),
	(629,'Pailitas',20),
	(630,'Paime',25),
	(631,'Paipa',15),
	(632,'Pajarito',15),
	(633,'Palermo',41),
	(634,'Palestina',17),
	(635,'Palestina',41),
	(636,'Palmar',68),
	(637,'Palmar de Varela',8),
	(638,'Palmas del Socorro',68),
	(639,'Palmira',76),
	(640,'Palmito',70),
	(641,'Palocabildo',73),
	(642,'Pamplona',54),
	(643,'Pamplonita',54),
	(644,'Pandi',25),
	(645,'Panqueba',15),
	(646,'Paratebueno',25),
	(647,'Pasca',25),
	(648,'Pat??a (El Bordo)',19),
	(649,'Pauna',15),
	(650,'Paya',15),
	(651,'Paz de Ariporo',85),
	(652,'Paz de R??o',15),
	(653,'Pedraza',47),
	(654,'Pelaya',20),
	(655,'Pensilvania',17),
	(656,'Peque',5),
	(657,'Pereira',66),
	(658,'Pesca',15),
	(659,'Pe??ol',5),
	(660,'Piamonte',19),
	(661,'Pie de Cuesta',68),
	(662,'Piedras',73),
	(663,'Piendam??',19),
	(664,'Pijao',63),
	(665,'Piji??o',47),
	(666,'Pinchote',68),
	(667,'Pinillos',13),
	(668,'Piojo',8),
	(669,'Pisva',15),
	(670,'Pital',41),
	(671,'Pitalito',41),
	(672,'Pivijay',47),
	(673,'Planadas',73),
	(674,'Planeta Rica',23),
	(675,'Plato',47),
	(676,'Policarpa',52),
	(677,'Polonuevo',8),
	(678,'Ponedera',8),
	(679,'Popay??n',19),
	(680,'Pore',85),
	(681,'Potos??',52),
	(682,'Pradera',76),
	(683,'Prado',73),
	(684,'Providencia',52),
	(685,'Providencia',88),
	(686,'Pueblo Bello',20),
	(687,'Pueblo Nuevo',23),
	(688,'Pueblo Rico',66),
	(689,'Pueblorrico',5),
	(690,'Puebloviejo',47),
	(691,'Puente Nacional',68),
	(692,'Puerres',52),
	(693,'Puerto As??s',86),
	(694,'Puerto Berr??o',5),
	(695,'Puerto Boyac??',15),
	(696,'Puerto Caicedo',86),
	(697,'Puerto Carre??o',99),
	(698,'Puerto Colombia',8),
	(699,'Puerto Concordia',50),
	(700,'Puerto Escondido',23),
	(701,'Puerto Gait??n',50),
	(702,'Puerto Guzm??n',86),
	(703,'Puerto Legu??zamo',86),
	(704,'Puerto Libertador',23),
	(705,'Puerto Lleras',50),
	(706,'Puerto L??pez',50),
	(707,'Puerto Nare',5),
	(708,'Puerto Nari??o',91),
	(709,'Puerto Parra',68),
	(710,'Puerto Rico',18),
	(711,'Puerto Rico',50),
	(712,'Puerto Rond??n',81),
	(713,'Puerto Salgar',25),
	(714,'Puerto Santander',54),
	(715,'Puerto Tejada',19),
	(716,'Puerto Triunfo',5),
	(717,'Puerto Wilches',68),
	(718,'Pul??',25),
	(719,'Pupiales',52),
	(720,'Purac?? (Coconuco)',19),
	(721,'Purificaci??n',73),
	(722,'Pur??sima',23),
	(723,'P??cora',17),
	(724,'P??ez',15),
	(725,'P??ez (Belalcazar)',19),
	(726,'P??ramo',68),
	(727,'Quebradanegra',25),
	(728,'Quetame',25),
	(729,'Quibd??',27),
	(730,'Quimbaya',63),
	(731,'Quinch??a',66),
	(732,'Quipama',15),
	(733,'Quipile',25),
	(734,'Ragonvalia',54),
	(735,'Ramiriqu??',15),
	(736,'Recetor',85),
	(737,'Regidor',13),
	(738,'Remedios',5),
	(739,'Remolino',47),
	(740,'Repel??n',8),
	(741,'Restrepo',50),
	(742,'Restrepo',76),
	(743,'Retiro',5),
	(744,'Ricaurte',25),
	(745,'Ricaurte',52),
	(746,'Rio Negro',68),
	(747,'Rioblanco',73),
	(748,'Riofr??o',76),
	(749,'Riohacha',44),
	(750,'Risaralda',17),
	(751,'Rivera',41),
	(752,'Roberto Pay??n (San Jos??)',52),
	(753,'Roldanillo',76),
	(754,'Roncesvalles',73),
	(755,'Rond??n',15),
	(756,'Rosas',19),
	(757,'Rovira',73),
	(758,'R??quira',15),
	(759,'R??o Ir??',27),
	(760,'R??o Quito',27),
	(761,'R??o Sucio',17),
	(762,'R??o Viejo',13),
	(763,'R??o de oro',20),
	(764,'R??onegro',5),
	(765,'R??osucio',27),
	(766,'Sabana de Torres',68),
	(767,'Sabanagrande',8),
	(768,'Sabanalarga',5),
	(769,'Sabanalarga',8),
	(770,'Sabanalarga',85),
	(771,'Sabanas de San Angel (SAN ANGEL)',47),
	(772,'Sabaneta',5),
	(773,'Saboy??',15),
	(774,'Sahag??n',23),
	(775,'Saladoblanco',41),
	(776,'Salamina',17),
	(777,'Salamina',47),
	(778,'Salazar',54),
	(779,'Salda??a',73),
	(780,'Salento',63),
	(781,'Salgar',5),
	(782,'Samac??',15),
	(783,'Samaniego',52),
	(784,'Saman??',17),
	(785,'Sampu??s',70),
	(786,'San Agust??n',41),
	(787,'San Alberto',20),
	(788,'San Andr??s',68),
	(789,'San Andr??s Sotavento',23),
	(790,'San Andr??s de Cuerqu??a',5),
	(791,'San Antero',23),
	(792,'San Antonio',73),
	(793,'San Antonio de Tequendama',25),
	(794,'San Benito',68),
	(795,'San Benito Abad',70),
	(796,'San Bernardo',25),
	(797,'San Bernardo',52),
	(798,'San Bernardo del Viento',23),
	(799,'San Calixto',54),
	(800,'San Carlos',5),
	(801,'San Carlos',23),
	(802,'San Carlos de Guaroa',50),
	(803,'San Cayetano',25),
	(804,'San Cayetano',54),
	(805,'San Cristobal',13),
	(806,'San Diego',20),
	(807,'San Eduardo',15),
	(808,'San Estanislao',13),
	(809,'San Fernando',13),
	(810,'San Francisco',5),
	(811,'San Francisco',25),
	(812,'San Francisco',86),
	(813,'San G??l',68),
	(814,'San Jacinto',13),
	(815,'San Jacinto del Cauca',13),
	(816,'San Jer??nimo',5),
	(817,'San Joaqu??n',68),
	(818,'San Jos??',17),
	(819,'San Jos?? de Miranda',68),
	(820,'San Jos?? de Monta??a',5),
	(821,'San Jos?? de Pare',15),
	(822,'San Jos?? de Ur??',23),
	(823,'San Jos?? del Fragua',18),
	(824,'San Jos?? del Guaviare',95),
	(825,'San Jos?? del Palmar',27),
	(826,'San Juan de Arama',50),
	(827,'San Juan de Betulia',70),
	(828,'San Juan de Nepomuceno',13),
	(829,'San Juan de Pasto',52),
	(830,'San Juan de R??o Seco',25),
	(831,'San Juan de Urab??',5),
	(832,'San Juan del Cesar',44),
	(833,'San Juanito',50),
	(834,'San Lorenzo',52),
	(835,'San Luis',73),
	(836,'San Lu??s',5),
	(837,'San Lu??s de Gaceno',15),
	(838,'San Lu??s de Palenque',85),
	(839,'San Marcos',70),
	(840,'San Mart??n',20),
	(841,'San Mart??n',50),
	(842,'San Mart??n de Loba',13),
	(843,'San Mateo',15),
	(844,'San Miguel',68),
	(845,'San Miguel',86),
	(846,'San Miguel de Sema',15),
	(847,'San Onofre',70),
	(848,'San Pablo',13),
	(849,'San Pablo',52),
	(850,'San Pablo de Borbur',15),
	(851,'San Pedro',5),
	(852,'San Pedro',70),
	(853,'San Pedro',76),
	(854,'San Pedro de Cartago',52),
	(855,'San Pedro de Urab??',5),
	(856,'San Pelayo',23),
	(857,'San Rafael',5),
	(858,'San Roque',5),
	(859,'San Sebasti??n',19),
	(860,'San Sebasti??n de Buenavista',47),
	(861,'San Vicente',5),
	(862,'San Vicente del Cagu??n',18),
	(863,'San Vicente del Chucur??',68),
	(864,'San Zen??n',47),
	(865,'Sandon??',52),
	(866,'Santa Ana',47),
	(867,'Santa B??rbara',5),
	(868,'Santa B??rbara',68),
	(869,'Santa B??rbara (Iscuand??)',52),
	(870,'Santa B??rbara de Pinto',47),
	(871,'Santa Catalina',13),
	(872,'Santa F?? de Antioquia',5),
	(873,'Santa Genoveva de Docorod??',27),
	(874,'Santa Helena del Op??n',68),
	(875,'Santa Isabel',73),
	(876,'Santa Luc??a',8),
	(877,'Santa Marta',47),
	(878,'Santa Mar??a',15),
	(879,'Santa Mar??a',41),
	(880,'Santa Rosa',13),
	(881,'Santa Rosa',19),
	(882,'Santa Rosa de Cabal',66),
	(883,'Santa Rosa de Osos',5),
	(884,'Santa Rosa de Viterbo',15),
	(885,'Santa Rosa del Sur',13),
	(886,'Santa Rosal??a',99),
	(887,'Santa Sof??a',15),
	(888,'Santana',15),
	(889,'Santander de Quilichao',19),
	(890,'Santiago',54),
	(891,'Santiago',86),
	(892,'Santo Domingo',5),
	(893,'Santo Tom??s',8),
	(894,'Santuario',5),
	(895,'Santuario',66),
	(896,'Sapuyes',52),
	(897,'Saravena',81),
	(898,'Sardinata',54),
	(899,'Sasaima',25),
	(900,'Sativanorte',15),
	(901,'Sativasur',15),
	(902,'Segovia',5),
	(903,'Sesquil??',25),
	(904,'Sevilla',76),
	(905,'Siachoque',15),
	(906,'Sibat??',25),
	(907,'Sibundoy',86),
	(908,'Silos',54),
	(909,'Silvania',25),
	(910,'Silvia',19),
	(911,'Simacota',68),
	(912,'Simijaca',25),
	(913,'Simit??',13),
	(914,'Sincelejo',70),
	(915,'Sinc??',70),
	(916,'Sip??',27),
	(917,'Sitionuevo',47),
	(918,'Soacha',25),
	(919,'Soat??',15),
	(920,'Socha',15),
	(921,'Socorro',68),
	(922,'Socot??',15),
	(923,'Sogamoso',15),
	(924,'Solano',18),
	(925,'Soledad',8),
	(926,'Solita',18),
	(927,'Somondoco',15),
	(928,'Sons??n',5),
	(929,'Sopetr??n',5),
	(930,'Soplaviento',13),
	(931,'Sop??',25),
	(932,'Sora',15),
	(933,'Sorac??',15),
	(934,'Sotaquir??',15),
	(935,'Sotara (Paispamba)',19),
	(936,'Sotomayor (Los Andes)',52),
	(937,'Suaita',68),
	(938,'Suan',8),
	(939,'Suaza',41),
	(940,'Subachoque',25),
	(941,'Sucre',19),
	(942,'Sucre',68),
	(943,'Sucre',70),
	(944,'Suesca',25),
	(945,'Supat??',25),
	(946,'Sup??a',17),
	(947,'Surat??',68),
	(948,'Susa',25),
	(949,'Susac??n',15),
	(950,'Sutamarch??n',15),
	(951,'Sutatausa',25),
	(952,'Sutatenza',15),
	(953,'Su??rez',19),
	(954,'Su??rez',73),
	(955,'S??cama',85),
	(956,'S??chica',15),
	(957,'Tabio',25),
	(958,'Tad??',27),
	(959,'Talaigua Nuevo',13),
	(960,'Tamalameque',20),
	(961,'Tame',81),
	(962,'Taminango',52),
	(963,'Tangua',52),
	(964,'Taraira',97),
	(965,'Taraz??',5),
	(966,'Tarqui',41),
	(967,'Tarso',5),
	(968,'Tasco',15),
	(969,'Tauramena',85),
	(970,'Tausa',25),
	(971,'Tello',41),
	(972,'Tena',25),
	(973,'Tenerife',47),
	(974,'Tenjo',25),
	(975,'Tenza',15),
	(976,'Teorama',54),
	(977,'Teruel',41),
	(978,'Tesalia',41),
	(979,'Tibacuy',25),
	(980,'Tiban??',15),
	(981,'Tibasosa',15),
	(982,'Tibirita',25),
	(983,'Tib??',54),
	(984,'Tierralta',23),
	(985,'Timan??',41),
	(986,'Timbiqu??',19),
	(987,'Timb??o',19),
	(988,'Tinjac??',15),
	(989,'Tipacoque',15),
	(990,'Tiquisio (Puerto Rico)',13),
	(991,'Titirib??',5),
	(992,'Toca',15),
	(993,'Tocaima',25),
	(994,'Tocancip??',25),
	(995,'Togu??',15),
	(996,'Toledo',5),
	(997,'Toledo',54),
	(998,'Tol??',70),
	(999,'Tol?? Viejo',70),
	(1000,'Tona',68),
	(1001,'Topag??',15),
	(1002,'Topaip??',25),
	(1003,'Torib??o',19),
	(1004,'Toro',76),
	(1005,'Tota',15),
	(1006,'Totor??',19),
	(1007,'Trinidad',85),
	(1008,'Trujillo',76),
	(1009,'Tubar??',8),
	(1010,'Tuch??n',23),
	(1011,'Tul??a',76),
	(1012,'Tumaco',52),
	(1013,'Tunja',15),
	(1014,'Tunungua',15),
	(1015,'Turbaco',13),
	(1016,'Turban??',13),
	(1017,'Turbo',5),
	(1018,'Turmequ??',15),
	(1019,'Tuta',15),
	(1020,'Tutas??',15),
	(1021,'T??mara',85),
	(1022,'T??mesis',5),
	(1023,'T??querres',52),
	(1024,'Ubal??',25),
	(1025,'Ubaque',25),
	(1026,'Ubat??',25),
	(1027,'Ulloa',76),
	(1028,'Une',25),
	(1029,'Ungu??a',27),
	(1030,'Uni??n Panamericana (??NIMAS)',27),
	(1031,'Uramita',5),
	(1032,'Uribe',50),
	(1033,'Uribia',44),
	(1034,'Urrao',5),
	(1035,'Urumita',44),
	(1036,'Usiacuri',8),
	(1037,'Valdivia',5),
	(1038,'Valencia',23),
	(1039,'Valle de San Jos??',68),
	(1040,'Valle de San Juan',73),
	(1041,'Valle del Guamuez',86),
	(1042,'Valledupar',20),
	(1043,'Valparaiso',5),
	(1044,'Valparaiso',18),
	(1045,'Vegach??',5),
	(1046,'Venadillo',73),
	(1047,'Venecia',5),
	(1048,'Venecia (Ospina P??rez)',25),
	(1049,'Ventaquemada',15),
	(1050,'Vergara',25),
	(1051,'Versalles',76),
	(1052,'Vetas',68),
	(1053,'Viani',25),
	(1054,'Vig??a del Fuerte',5),
	(1055,'Vijes',76),
	(1056,'Villa Caro',54),
	(1057,'Villa Rica',19),
	(1058,'Villa de Leiva',15),
	(1059,'Villa del Rosario',54),
	(1060,'Villagarz??n',86),
	(1061,'Villag??mez',25),
	(1062,'Villahermosa',73),
	(1063,'Villamar??a',17),
	(1064,'Villanueva',13),
	(1065,'Villanueva',44),
	(1066,'Villanueva',68),
	(1067,'Villanueva',85),
	(1068,'Villapinz??n',25),
	(1069,'Villarrica',73),
	(1070,'Villavicencio',50),
	(1071,'Villavieja',41),
	(1072,'Villeta',25),
	(1073,'Viot??',25),
	(1074,'Viracach??',15),
	(1075,'Vista Hermosa',50),
	(1076,'Viterbo',17),
	(1077,'V??lez',68),
	(1078,'Yacop??',25),
	(1079,'Yacuanquer',52),
	(1080,'Yaguar??',41),
	(1081,'Yal??',5),
	(1082,'Yarumal',5),
	(1083,'Yolomb??',5),
	(1084,'Yond?? (Casabe)',5),
	(1085,'Yopal',85),
	(1086,'Yotoco',76),
	(1087,'Yumbo',76),
	(1088,'Zambrano',13),
	(1089,'Zapatoca',68),
	(1090,'Zapay??n (PUNTA DE PIEDRAS)',47),
	(1091,'Zaragoza',5),
	(1092,'Zarzal',76),
	(1093,'Zetaquir??',15),
	(1094,'Zipac??n',25),
	(1095,'Zipaquir??',25),
	(1096,'Zona Bananera (PRADO - SEVILLA)',47),
	(1097,'??brego',54),
	(1098,'??quira',41),
	(1099,'??mbita',15),
	(1100,'??tica',25);

-- INSERT PERSONA
INSERT INTO persona (
	id,
    id_tipo_documento,
    documento,
    primer_nombre,
    segundo_nombre,
    primer_apellido,
    segundo_apellido,
    fecha_nacimiento,
    id_municipio,
    id_sexo,
    numero_telefono,
    numero_celular,
    direccion,
    id_rol
)
VALUES (1, 3, '1111111111', 'Admin', 'Admin', 'Admin', 'Admin', '1980-10-19', 1012, 1, '7271234', '3165477205', 'Admin city', 1);
