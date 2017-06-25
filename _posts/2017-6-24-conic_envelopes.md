---
layout: post
title: "Conic Envelope Visualization"
tags: math conics p5js 
math : true
---

In my precalc class, we were introduced to conics with a very cool activity
involving a square piece of wax paper and a protractor. The activity worked like so:

1. Draw a circle roughly in the center of the wax paper with a radius of about a
   quarter of the paper length (just make sure the circle isn't huge)
2. Mark a point somewhere on the paper
3. Continue to fold the paper so that the marked point lies on the circle until
   you are pleased with the resulting image 

Depending on where you put the point (around the circle, far from the circle, on
or the center of the circle), you'll see a different conic (an ellipse, hyperbola,
or circle respectively). If you want to draw a parabola just use a line instead of a circle.
This generates what is called an *envelope* of a conic, which is just a set of
lines which are each tangent to the conic. The reason this works for the ellipse
is that an ellipse can be defined given two points (the foci) and a distance as the locus of all
points for which the sum of the distances from each foci is constant. In the
case of the wax paper the two foci are the chosen point and the center of the
circle and the distance is the radius of the circle. When you
fold the marked point to the circle, the distance from the center of the circle
to the fold line plus the distance from the fold line to the point is always
equal to the radius of the circle. A similar idea explains why choosing a
different point will produce different conics.

I thought this conic envelope thing was pretty cool so I decided to write a little
[visualization][visualization] for it using [p5.js](p5js.org) to render the
graphics. I was actually pretty surprised with how simple the code for
this was. All of the actual work takes place in this little loop:
{% highlight javascript %}
for(var rads = 0; rads < TWO_PI; rads+=epsilon){
    //Generate a point on a circle with a radius of one fourth of the smallest
    //screen dimension and a center at the center of the screen
    var x = SMALL/4*Math.cos(rads) + WIDTH/2;
    var y = SMALL/4*Math.sin(rads) + HEIGHT/2;

    //p is the midpoint between the marked focus and the current point on the
    //circle (x, y)
    var p = {x:(x+focus.x)/2, y:(y+focus.y)/2};
    //This is the slope of a line perpindicular to the line between the focus
    //and (x, y)
    var slope = -1*(focus.x - x)/(focus.y - y);
    
    //Draw a line through point p with slope slope (recognize the point slope
    //form?)
    var farLeftY = slope*(0 - p.x) + p.y; 
    var farRightY = slope*(WIDTH - p.x) + p.y;
    line(0, farLeftY, WIDTH, farRightY);
}
{% endhighlight %}
This algorithm works by moving a point around a circle and then drawing
the perpendicular bisector of that point and the given point. This
geogebra [visualization][geogebra] I made shows how and why that works.

TODO
====
Explain possible improvements

Explain in more depth why algo works

[visualization]: {{site.url}}/envelope/
[geogebra]: https://ggbm.at/x2fKkWNk
