---
layout: post
title: "Proving the Binomial Coefficient is Always an Integer"
tags: math binomial proof
use_math: true
---

Background
---------
Binomail coefficient is ...

The problem with it is...


Proof
----
First, let us assume given 
{% raw %} \\(\binom{n}{r} \\) {% endraw %} that 
{% raw %} \\(r < \frac{n}{2} \\) {% endraw %} 
and obviously,
{% raw %}
\\[
    \binom{n}{r}
    = \frac{n!}{(n-r)!\cdot r!}
    = \frac{n\cdot (n-1) \cdot (n-2) \cdot \dots (r+1)}{(n-r)!}
\\]
{% endraw %}
now the next step is not as obvious
{% raw %}
\\[
    = \frac{n\cdot (n-1) \cdot (n-2) \cdot \dots (n-r + 1)}{r!}
\\]
{% endraw %}
this comes from the fact that since 
{% raw %} \\(r>\frac{n}{2}\\) {% endraw %}
then, 
{% raw %} \\( n - r > r \\){% endraw %}
which shows that at least some elements from 
{% raw %} \\( (n - r)! \\){% endraw %}
will cancel out compeltely with elements from
{% raw %} \\( n\cdot (n-1) \cdot (n-2) \cdot \dots (r+1) \\) {% endraw %}
the exact number of elements that cancel out ends up being
{% raw %} \\( (n - r) - r  = n - 2r\\){% endraw %}
So, as 
{% raw %} \\( n - 2r\\){% endraw %}
of the smallest elements from the numerator cancelled out with 
{% raw %} \\( n - 2r\\){% endraw %}
of the largest elements from the denomonator we are left with
{% raw %}
\\[
    = \frac{n\cdot (n-1) \cdot (n-2) \cdot \dots ((n-r + 1) + (n-2r) )}{((n-r) - (n - 2r))!}
    = \frac{n\cdot (n-1) \cdot (n-2) \cdot \dots (n-r + 1)}{r!}
\\]
{% endraw %}
So we now know that the number of integers between 
{% raw %} \\( n \\){% endraw %}
and
{% raw %} \\( n - r + 1\\){% endraw %}
is equal to 
{% raw %} \\( r \\){% endraw %}
And finally, given at least
{% raw %} \\( r \\){% endraw %}
consecutive natural numbers there will be a multiple of 
{% raw %} \\( r \\){% endraw %}
in that set
