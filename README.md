# ProyectoFinalProyecto-final-de-VA

1.	INTRODUCCIÓN
1.1	Contexto de desarrollo del proyecto
El Departamento de Planeación de la Universidad de Los Andes colabora en la realización de diferentes estudios en la universidad. Estos estudios buscan conocer la percepción de diferentes públicos en la universidad como estudiantes, profesores, exalumnos, directivos, entre otros, sobre varios aspectos de la institución como programas académicos, visibilidad de la universidad, infraestructura, servicios prestados, etc.
Uno de estos estudios se le conoce como “Estudios de Satisfacción” (ESAT). Este estudio busca entender la percepción estudiantil sobre aspectos de calidad de la universidad. El ESAT se realiza por medio de encuestas aplicadas a estudiantes de los diferentes niveles académicos:
•	Pregrado
•	Especialización
•	Maestría
•	Doctorado
Esta encuesta cuenta con cerca de 43 preguntas dirigidas a la satisfacción de aspectos específicos de la universidad con, en casi todos los casos, 5 posibles respuestas que miden el grado de satisfacción. Estas preguntas se concentran en describir el nivel de aceptación de la comunidad estudiantil en 4 puntos principales:
1.	Satisfacción general
2.	Imagen institucional
3.	Procesos académicos
4.	Servicios prestados por la universidad.
Actualmente se cuenta con los datos de las respuestas de estas encuestas realizadas desde el 2011 hasta el 2015.


1.2	Problema
El Departamento de Planeación no cuenta con una asesoría adecuada de un equipo informático que le permita explotar la información correctamente. En este momento, para estudiar los resultados se realizan reportes en Excel que son tediosos de crear, y que no permiten observar la información de manera adecuada. Un ejemplo se muestra a continuación en la Figura 1
 
Figura 1. Reportes actuales del ESAT
Se observan unos filtros básicos a la izquierda en modo de listas con un gráfico de barras apiladas a la derecha. No es posible leer correctamente la información y realizar análisis y comparaciones son tareas prácticamente imposibles de llevar a cabo.
En concreto, el departamento no cuenta con una herramienta que le permita estudiar y analizar la gran cantidad de datos que tiene para poder sacarles provechos, hacer comparaciones y entender en realidad la percepción estudiantil frente a la satisfacción institucional
 
2.	DESCRIPCIÓN GENERAL
Con el fin de solucionar el problema, se han definido los objetivos del proyecto, así como un desglose del proceso qué-porqué-cómo que servirá como guía del curso del proyecto
2.1	Objetivo general
Construir una herramienta de análisis visual que reciba los datos de las encuestas y permita realizar análisis sobre la información de manera fácil y efectiva
2.2	El qué
Los datos se presentan en forma de tabla. El nivel de granularidad de los datos en cada fila se puede definir como: 
“Cada fila representa la respuesta de un estudiante, de un nivel de estudios, de un género, que pertenece a un programa, departamento y facultad en un año determinado, a una pregunta que hace parte de un sub tema, y a su vez de un tema “
Luego tenemos varios datos y atributos. La medición hace referencia al año de toma de la encuesta; es categórico y ordenado denotando tiempo. El segundo es categórico y hace referencia al nivel de estudios de la persona que responde; tiene 4 categorías. En tercer lugar tenemos el género que es categórico no ordenado con dos posibles valores: M y F. El cuarto es categórico y hace referencia a la facultad a la que pertenece la persona que respondió. El departamento y el programa que son el quinto y el sexto atributo también son categóricos no ordenados. Después tenemos el tema de la pregunta, el subtema y la pregunta que son categóricos y no ordenados. Por último tenemos la opción de respuesta seleccionada que es categórica pero es una medida.
2.3	El porqué
•	Presentar el resumen del resultado de las encuestas de satisfacción.
•	Identificar los factores más fuertes de la universidad en la precepción de los estudiantes
•	Identificar los factores con mayor oportunidad de mejora en la universidad en la percepción de los estudiantes
•	Encontrar los públicos más y menos satisfechos en la universidad (clasificados por criterios de nivel de estudios, facultar …)
•	Realizar comparaciones del nivel de satisfacción de los estudiantes discriminando por varios criterios: Año de presentación, nivel de estudios, facultad a la que pertenecen, departamento al que pertenecen, programa al que pertenecen, género.
•	Observar la evolución temporal de los indicadores en los diferentes públicos.
•	Observar la correlación existente entre los niveles de satisfacción y las características de los públicos encuestados.
•	Buscar características desconocidas que permitan entender mejor a la población y a su percepción de la universidad.
2.4	El qué.
