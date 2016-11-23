
## Proyecto de curso Visual Analytics
## Informe de Avance
Implementación de un sistema de visualización y análisis de datos para encuestas de satisfacción en la Universidad de Los Andes.


Autores:
Johann Felipe González Ávila
Javier Stevenson Contreras Rojas
Juan Camilo Ortiz Román

Asesores:
José Tiberio HERNÁNDEZ, John Alexis GUERRA GÓMEZ


Bogotá, 2016

### Caracterización

El Departamento de Planeación de la Universidad de Los Andes se encarga de realizar múltiples estudios de percepción con diferentes propósitos en la institución. Uno de estos estudios es el “Estudio de Satisfacción” (ESAT). Éste pretende medir la satisfacción de estudiantes de la universidad en los diferentes niveles de estudio (pregrado, especialización, maestría y doctorado) por medio de la aplicación de encuestas.
Actualmente se cuentan con datos de encuestas realizadas desde el año 2011 hasta el 2015, de un cuestionario con 43 preguntas y que han sido aplicadas a 15000 estudiantes en promedio por año, recibiendo respuestas de aproximadamente un tercio de la muestra (5000) cada año.
El departamento cuenta con una gran cantidad de datos producto de las encuestas, pero no pueden explotarlos debido a la falta de herramientas computacionales y de experiencia en el área de visualización analítica. Se desea poder realizar análisis comparativos y análisis sobre los datos actuales, que al día de hoy no se tienen en cuenta en la estadísticas convencionales.
Los datos se presentan en forma de tabla. El nivel de granularidad de los datos en cada fila se puede definir como: “Cada fila representa la respuesta de un estudiante, de un nivel de estudios, de un género, que pertenece a un programa, departamento y facultad en un año determinado, a una pregunta que hace parte de un sub tema, y a su vez de un tema “


Cada registro contiene los siguientes atributos:

-Medición, que hace referencia al año de toma de la encuesta [2011-2015]. 
-Nivel, es el nivel de estudios del estudiante que registra su respuesta a la encuesta {Pregrado, especialización, maestría, doctorado}
-Género, categórico con dos valores posibles My F, hace referencia al género del estudiante que registra su respuesta a la encuesta.
-Programa, departamento y facultad: el programa de estudios, el departamento y la facultad dentro de la universidad del estudiante que registra su respuesta a la encuesta.
-Tema, categorización macro de la pregunta. Cuatro opciones disponibles
-Subtema, subcategoría, existen hasta seis subtemas por un tema.
-Pregunta, una pregunta textual de las 43 preguntas de la encuesta.
-Respuesta, la opción en escala likert de 6 respuestas {NS/NR, Muy insatisfecho, insatisfecho, ni satisfecho ni insatisfecho, satisfecho , muy satisfecho}
-Num_Respuesta: número de respuestas en combinación PREGUNTA X RESPUESTA


### Tareas en términos de Tamara
Las tareas con mayor prioridad en la elaboración del proyecto son:

-Presentar el resumen del resultado de las encuestas de satisfacción.
-Realizar comparaciones del nivel de satisfacción de los estudiantes discriminado por los atributos que tienen en los datos.
-Encontrar la correlación existente entre los niveles de satisfacción y las características de los públicos encuestados.

También se identificaron tareas que, si bien no tienen el mismo nivel de importancia y deseabilidad que las ya mencionadas, son relevantes en la realización del proyecto. A saber:
-Identificar los factores más fuertes y aquellos con mayor oportunidad de mejora en la percepción de los estudiantes
-Identificar la caracterización de la población más y menos satisfecha en la universidad.
-Observar la evolución temporal de los indicadores en los diferentes públicos.


#### Estado del arteRealizamos una investigación de referentes útiles de acuerdo al contexto de problema que estamos trabajando. También consultamos los premios anuales de visualización (http://www.informationisbeautifulawards.com/) con el objetivo de encontrar tendencias gráficas y de interacción en el ejercicio de la profesión.


En primer lugar, buscamos referentes de visualización de datos de encuestas. Estos son datos que, por lo general, se encuentran escala Likeart y pueden manejar un gran número de entradas en sus respuestas.


Survey Data Visualization Application (https://www.youtube.com/watch?v=Een1u5-WUMg) es un proyecto desarrollado por Jiwei Zhang, estudiante de la Universidad Carnegie Mellon en donde los datos de una encuesta en escala de 5, 7 y 9 pasos son analizados a través de una aplicación de visualización. LA aplicación está desarrollada en jQuery y D3.js y permite el reordenamiento de variables e introduce una correlación explicada a través de niveles en coordenadas paralelas verticales. En este caso no existe noción temporal, y la categorización cromática de las respuestas dificulta la lectura de los datos.


También encontramos como ejemplo una visualización desarrollada por Evergreen Data (http://stephanieevergreen.com/) para la visualización de datos de prueba obtenidos por ellos mismos. En este caso se hace uso de barras apiladas para visualizar las respuestas obtenidas en las encuestas. Esta decisión es un acierto en cuanto a la proporción y categorización eficaz de las respuestas a cada pregunta en cuanto al pequeño número de variables analizadas. Pero por esta misma razón la aplicación se queda corta en el nivel de detalle y tampoco contempla una noción temporal en los datos.


SurveyVisualizer fue una aplicación con la que se publicó un paper para la conferencia Infovis en el 2003 (http://www.macrofocus.com/publications/infovis2003.pdf). Lo relevante de este referente es el uso ejemplar de marcadores de comparación en las tres capas coordinadas que maneja de los datos. También incluye un zoom-in y selección de nodos de acuerdo al interés del usuario. Este referente si maneja una noción temporal pero su interfaz no es amigable y requiere de un breve entrenamiento para familiarizarse con los controles de la aplicación.


De igual forma revisamos dos referentes premios por la organización Kantar, los premios Information is Beautiful. De allí obtuvimos dos referentes por su manejo de las respuestas individuales en estudios estadísticos que fueron realizados en dos contextos diferentes. 


El primer referente es JobMarketTracker, desarrollado por A. Van Dam y R.Lightner (http://graphics.wsj.com/job-market-tracker/). Esta aplicación es una visualización del seguimiento de la ganancia y pérdida de empleos por sector para cada uno de los años. Es recalcable el indicio de storytelling en esta aplicación, el manejo de datos individuales y la noción de temporalidad de los registros, lo que permite ver una tendencia macro pero observar las peculiaridades de cada nodo.


Por otra parte está la visualización de las encuestas de Urban Governance, realizadas por UNHabitat (https://urbangovernance.net/es/). En este referente también se crea un storytelling para cada una de las preguntas contenidas en la encuesta, lo que lleva al usuario a una experiencia de interacción que lo contextualiza con el contexto así el usuario sea completamente ajeno a este. También es positivo el manejo de respuestas individuales como nodos organizados en el espacio de manera ordenada y clara.

###Replanteamiento de la solución
La propuesta con la que se decide trabajar es un gráfico de coordenadas paralelas, con los datos agregados por categorías. Se propone una estrategia por capas, que va de lo general a lo específico. En primer lugar se encuentra un resumen por categorías de preguntas y sobre este resumen se van aplicando filtros que amplían el detalle de las respuestas. El filtrado por categorías permite explorar cada categorías y subcategoría de las 43 preguntas cruzándolas con atributos demográficos como género, facultad y programa de los estudiantes que responden las respuestas. Sobre el resumen de este cruce se propone incluir nodos de respuesta que llevan a la visualización del registro unitario de la respuesta.