author: Nicolas Nemeth, 01506257

WHICH BIVARIATE COLOR SCHEME I CHOSE AND WHY?

Not only do people have different preferences when it comes to color (e.g. one 
might favor blue, another green), but also can people have different kind of 
color blindness or visual impairments. Therefore, I decided to implement 4-5 different
bivariate color schemes instead of a single one. Apart from that, I only selected sequential
bivariate color schemes, since this has the advantage of encoding the trend of both dimensions
using colors, which would not be possible by using diverging bivariate color schemes.
In addition, I also added the option to increase the color saturation of the respective
bivariate color schemes, to make it easier to distinguish between the colors.
For example people who have dyschromatopsia find it easier to distinguish between
red and green when the color saturation is richer (that is also what a friend of mine
told me who has it).

Additional remarks to the code,

store.js,
- I replaced some of the existing methods and added getters, mutations and getters necessary to communicate all relevant information between the elements.

App.vue,
- added event listeners for selecting a bivariate color scheme as well
  as for selection of whether color saturation should be increased or not
- contains all additional css styling

ChoroplethMap.vue,
- I added a rect and a g child elements to the svg element. The rect is used
  to define what happens when one clicks an empty part of the map, as well as
  to add a very light gray to the background of the map for slight contrast.
- the g element contains the path elements

Scatterplot.vue,
- define g child elements inside the svg element in the right order
- for further details please see comments in the file


SOURCES,
In addition to the provided boilderplate code I used following websites
to gain insights/ideas into how to approach the tasks outlined in the assignment:

[1]  https://www.d3-graph-gallery.com/graph/interactivity_brush.html
[2]  https://bl.ocks.org/cmgiven/abca90f6ba5f0a14c54d1eb952f8949c
[3]  https://observablehq.com/@d3/bivariate-choropleth

!!!  INSPIRED THE FUNCTION increaseColorSaturation() ON LINE 198 IN THE FILE Scatterplot.vue !!!
[4]  https://observablehq.com/@d3/working-with-color

[5]  https://vuex.vuejs.org/
[6]  https://vuejs.org/
[7]  https://www.d3-graph-gallery.com/graph/interactivity_brush.html
[8]  https://github.com/d3/d3-brush
[9]  https://www.d3indepth.com/geographic/
[10] https://observablehq.com/@harrystevens/introducing-d3-geo-scale-bar