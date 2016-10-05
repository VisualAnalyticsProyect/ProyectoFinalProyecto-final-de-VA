# ProyectoFinalProyecto-final-de-VA
# Proyecto de curso Visual Analytics
Implementación de un sistema de visualización y análisis de datos para encuestas de satisfacción en la Universidad de Los Andes.


Autores:
Johann Felipe González Ávila
Javier Stevenson Contreras Rojas
Juan Camilo Ortiz Román

Asesores:
José Tiberio HERNÁNDEZ, John Alexis GUERRA GÓMEZ


Bogotá, 2016

### Resumen

El Departamento de Planeación de la Universidad de Los Andes se encarga de realizar múltiples estudios de percepción con diferentes propósitos en la institución. Uno de estos estudios es el “Estudio de Satisfacción” (ESAT). Éste pretende medir la satisfacción de estudiantes de la universidad en los diferentes niveles de estudio (pregrado, especialización, maestría y doctorado) por medio de la aplicación de encuestas.
Actualmente se cuentan con datos de encuestas realizadas desde el año 2011 hasta el 2015, de un cuestionario con 43 preguntas y que han sido aplicadas a 15000 estudiantes en promedio por año, recibiendo respuestas de aproximadamente un tercio de la muestra (5000) cada año.
El departamento cuenta con una gran cantidad de datos producto de las encuestas, pero no pueden explotarlos debido a la falta de herramientas computacionales y de experiencia en el área de visualización analítica. Se desea poder realizar análisis comparativos y análisis sobre los datos actuales, que al día de hoy no se tienen en cuenta en la estadísticas convencionales.

### Introducción
##### Contexto de desarrollo del proyecto
El Departamento de Planeación de la Universidad de Los Andes colabora en la realización de diferentes estudios en la universidad. Estos estudios buscan conocer la percepción de diferentes públicos en la universidad como estudiantes, profesores, exalumnos, directivos, entre otros, sobre varios aspectos de la institución como programas académicos, visibilidad de la universidad, infraestructura, servicios prestados, entre otros.

Uno de estos estudios es el “Estudios de Satisfacción” (ESAT). Este estudio busca entender la percepción estudiantil sobre aspectos de calidad de la universidad. El ESAT se realiza por medio de encuestas aplicadas a estudiantes de los diferentes niveles académicos:
- Pregrado
- Especialización
- Maestría
- Doctorado

Esta encuesta cuenta con cerca de 43 preguntas dirigidas a la satisfacción de aspectos específicos de la universidad con, en casi todos los casos, 5 posibles respuestas que miden el grado de satisfacción. Estas preguntas se concentran en describir el nivel de aceptación de la comunidad estudiantil en 4 puntos principales:
Satisfacción general
Imagen institucional
Procesos académicos
Servicios prestados por la universidad.
Actualmente se cuenta con los datos de las respuestas de estas encuestas realizadas desde el 2011 hasta el 2015.


#### Problema
El Departamento de Planeación no cuenta con una asesoría adecuada de un equipo informático que le permita explotar la información correctamente. En este momento, para estudiar los resultados se realizan reportes en Excel que son tediosos de crear, y que no permiten observar la información de manera adecuada. 

Un ejemplo se muestra a continuación en la Figura 1
[Referencia a imagen]
Figura 1. Reportes actuales del ESAT

Se observan unos filtros básicos a la izquierda en modo de listas con un gráfico de barras apiladas a la derecha. No es posible leer correctamente la información y realizar análisis y comparaciones son tareas prácticamente imposibles de llevar a cabo.
En concreto, el departamento no cuenta con una herramienta que le permita estudiar y analizar la gran cantidad de datos que tiene para poder sacarles provechos, hacer comparaciones y entender en realidad la percepción estudiantil frente a la satisfacción institucional.


### Descripción General
Con el fin de solucionar el problema, se han definido los objetivos del proyecto, así como un desglose del proceso qué-por qué-cómo que servirá como guía del curso del proyecto

#### Objetivo general
Construir una herramienta de análisis visual que reciba los datos de las encuestas y permita realizar análisis sobre la información de manera fácil y efectiva.

#### El qué
Los datos se presentan en forma de tabla. El nivel de granularidad de los datos en cada fila se puede definir como: 
“Cada fila representa la respuesta de un estudiante, de un nivel de estudios, de un género, que pertenece a un programa, departamento y facultad en un año determinado, a una pregunta que hace parte de un sub tema, y a su vez de un tema “
Luego tenemos varios datos y atributos. La medición hace referencia al año de toma de la encuesta; es categórico y ordenado denotando tiempo. El segundo es categórico y hace referencia al nivel de estudios de la persona que responde; tiene 4 categorías. En tercer lugar tenemos el género que es categórico no ordenado con dos posibles valores: M y F. El cuarto es categórico y hace referencia a la facultad a la que pertenece la persona que respondió. El departamento y el programa que son el quinto y el sexto atributo también son categóricos no ordenados. Después tenemos el tema de la pregunta, el subtema y la pregunta que son categóricos y no ordenados. Por último tenemos la opción de respuesta seleccionada que es categórica pero es una medida (Nada satisfecho, satisfecho.

#### El porqué
- Presentar el resumen del resultado de las encuestas de satisfacción.
- Identificar los factores más fuertes de la universidad en la percepción de los estudiantes.
- Identificar los factores con mayor oportunidad de mejora en la universidad en la percepción de los estudiantes
- Encontrar los públicos más y menos satisfechos en la universidad (clasificados por criterios de nivel de estudios, facultar …)
- Realizar comparaciones del nivel de satisfacción de los estudiantes discriminando por varios criterios: Año de presentación, nivel de estudios, facultad a la que pertenecen, departamento al que pertenecen, programa al que pertenecen, género.
- Observar la evolución temporal de los indicadores en los diferentes públicos.
- Observar la correlación existente entre los niveles de satisfacción y las características de los públicos encuestados.
- Buscar características desconocidas que permitan entender mejor a la población y  su percepción de la universidad.
#### El Cómo.
##### Marcas
- Puntos: para establecer posición de los atributos en el tiempo.
- Líneas: para mostrar resumen, como el resultado de las encuestas de satisfacción.
- Áreas: para poder realizar comparaciones y presentar la información categórica de una manera efectiva.
##### Canales
- Regiones espaciales: para mostrar los atributos categóricos, facultad departamento programa, primero resumiendo y luego si se desea mostrando al detalle. por ejemplo si se hace zoom a la facultad que muestre por departamentos.
- Longitud: para mostrar niveles de satisfacción en las encuestas.
- Tamaño: para mostrar los factores más importantes de la universidad en la percepción de los estudiantes.
- Posición en una escala común: para alinear los datos en el tiempo.
Color huge:  para determinar los temas de las preguntas.
#### Filtrado
Generar filtros para los diferentes géneros, nivel de estudios o facultad

<Mock Up y primeras propuestas>
# Bitácora de la primera reunión
Septiembre 28, 2016

#### Contexto breve

La unidad encargada (ahora el Departamento de Planeación) nace en 2007, el estudio de satisfacción se realiza desde 2011 en adelante. Este estudio se realiza al final de cada año, tiene una tasa de respuesta del 30-35%, son 43 preguntas en una escala de respuesta de “muy insatisfecho” a “muy satisfecho”.
#### Aproximación a los objetivos y deseos
Se busca aprovechar/explotar la información recolectada, generar un valor agregado sobre la información para las dependencias que contratan los estudios (licitaciones).
El cliente enuncia deseos: comparaciones de diversa índole, encontrar correlaciones entre los datos, desglose por niveles académicos (pregrado, especialización, maestría, doctorado), saber si el nivel es un factor influyente en la medida de satisfacción del estudiante, también quisiera tener alguna caracterización de los usuarios y conocer con cuáles items/preguntas están más satisfechos los encuestados.

Identifica como problemas el tener todo acoplado en Excel y que esta herramienta no permite realizar gráficas descriptivas.

#### Usuarios
Los usuarios de la aplicación serán algunas unidades centrales (Dirección de planeación, Gerencia del Campus, Vicerrectoría Académica, Vicerrectoría Administrativa y Decanatura de Estudiantes) y algunas unidades académicas, en especial directores de programa, decanos y coordinadores. Esto implica un manejo de diferentes niveles de granularidad (a nivel de facultad, de programa o de servicios más generales). Se plantean pruebas de usuario con usuarios reales; existe un especial interés del cliente en realizar pruebas con coordinadores de programa que no sean cercanos a la tecnología - usabilidad).
#### Otras consideraciones
Se plantea la posibilidad de que experiencias como prácticas académicas o intercambios influyan sobre la satisfacción de los estudiantes, pero esta información no la contiene los datos. Por cuestiones de confidencialidad se deja de lado la posibilidad de comparar promedios de los encuestados y realizar una segmentación sobre este atributo.

