---
layout: post
title: "ABCTF 2016: a small broadcast"
tags: ctf abctf_2016 writeup
use_math: true
---

problem
=====
I RSA encrypted the same message 3 different times with the same exponent. Can you decrypt [this][1]?

solution
========
As usual, my first instinct in attempting to solve this problem was to 
just factor the modulus using [msieve][5]. But, a quick test reveals that 
the moduli are to large for msieve to even attempt to factor *(on the order 1024 bits)*. 

A quick google of *a small broadcast rsa* reveals the wikipedia page
for [Coppersmith's attack][2]. **Håstad's broadcast attack** on this page immediatly jumps
out at me for its simmilarity with the name of this problem. Further reading 
confirms this hunch. **Håstad's broadcast attack** is exactly what we need.

Put simply this attack hinges on the **Chinese Remainders Theorem**;
a thousand year old identity that proves recreational math has far 
reaching implications unfathomable at the time of it's discovery.

To understand the **CRT's** relavence to this problem we must first recall both the **Textbook RSA
function**: 

$$
  p^e\equiv C\pmod N
$$

and that we are given three of these pairs in which $p$ and $e$ 
are held constant.

The **Chinese Remainder Theorem** tells us that given 

$$
  x\equiv a_1\pmod{N_1}\\
  \vdots\\
  x\equiv a_i\pmod{N_i}
$$

we can uniquely determine x. This is great news because this is the exact situation we are in. 

$$
  p^e\equiv C_1\pmod{N_1}\\
  \vdots\\
  p^e\equiv C_3\pmod{N_3}
$$

With Some more searching I found that one of my favorite [haskell libraries][3]
already has a function to compute $x$ or $p^e$ from Eq. 2 and 3. 

So, after a bit of proccessing and guessing at the public key (it ends up being 3!!!) 
we end up with the flag ([code][4]):

<center><code>abctf{ch!n3s3_rema1nd3r_the0rem_is_to0_op_4_m3}</code></center>

ps.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sorry for using haskell. email me for any questions on how the program works!

[1]:{{site.url}}/assets/abctf_2016/a_small_broadcast/broadcast.txt
[2]:https://en.wikipedia.org/wiki/Coppersmith%27s_attack
[3]:https://hackage.haskell.org/package/arithmoi-0.4.2.0/docs/Math-NumberTheory-Moduli.html#v:chineseRemainder
[4]:{{site.url}}/assets/abctf_2016/a_small_broadcast/chinese.hs
[5]:https://github.com/radii/msieve
