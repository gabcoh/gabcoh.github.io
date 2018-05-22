---
layout: post
title: "Writing a Homebrew formula"
tags: mac homebrew foss
---
I already love [homebrew](brew.sh). From the beautiful interface to the checks it puts in
place to keep me from doing something stupid, homebrew is great (that being
said, I could do with shorter update times and less breaking but updating is
done with git and building a package manager is hard). 

Today, though, I learned about just one more reason why homebrew is great. If
you have ever wondered how homebrew seems to have an endless supply of packages
(until it doesn't) this is thanks to great tooling. The work flow for adding a
new formula to homebrew is really good so right now I'll walk you through how
its done by making a formula for [Paul Batchelor's
soundpipe](https://github.com/PaulBatchelor/soundpipe) library. This library is
a requirement for a different program I want to install
([sporth](https://github.com/PaulBatchelor/Sporth)) so I may update this post in
the future with information on how to create that formula as well. 

Full disclosure, at the time of writing, this formula has not yet been merged
into the homebrew package repo so I may have to change it a bit to be completely
compliant with their standards.

To begin, most important information regarding writing formulas can be found
[here](https://github.com/Homebrew/brew/blob/master/docs/Formula-Cookbook.md)
and if you would rather go to the source as opposed to seeing a walkthrough go
there now.

The workflow of creating a new homebrew formula starts appropriatly with the
`brew create url` command. Where `url` points to the tarball of the project's
source. Assuming the project is on github, this url is of the form
`https://github.com/:user:/:repo:/archive/:tag:.tar.gz`. This url points to a
tarball of the repo's source at the specified tag. For soundpipe this turns out
to be:
{% highlight shell %}
brew create "https://github.com/PaulBatchelor/soundpipe/archive/v1.7.0.tar.gz"
{% endhighlight %}

This will download the tarball for the cache and open up `$EDITOR` with the
formula's ruby file loaded. At this point you should read and then delete all of
the auto generated comments (brew will not let you merge if you do not do this).
Make sure all of the auto filled fields are correct and if they aren't fix them.
The description can neither start with an indefinite article nor end with a
period, so fix that if it does. Also if the project has any dependencies, first make
sure they can be installed through homebrew and then list them by inserting a
new line after the `sha256` field and then adding `depends_on "dependency"` 
Soundpipe's readme tells us that it depends on `libsndfile`.

Now it's time to actually build the thing! Start by running
{% highlight shell %}
brew install soundpipe --interactive
{% endhighlight %}
This will put you into a temporary directory with the decompressed source. 
Brew provides you with many useful env variables and to see them all
just run `env | grep HOMEBREW`. The most important one that we'll be using is
`$HOMEBREW_FORMULA_PREFIX`. This points to the location where the package should
be installed. At this point, read the repo's `README` and figure out how to
install the package. For soundpipe this comes down to a basic
{% highlight shell %}
make 
make install
{% endhighlight %}
However, `make install` does not use the correct prefix so we'll have to set it
ourselves by running `make install PREFIX=$HOMEBREW_FORMULA_PREFIX` instead.
Because soundpipe comes with tests and examples, you should copy them over to 
the `$HOMEBREW_FORMULA_PREFIX/soundpipe/share` as well. 

Once you have figured out how to install the package and actually done it once
convert the steps you ran manually into ruby using the `system` function to run
shell commands and ruby's builtin commands over shell commands if possible.
For soundpipe this is
{% highlight ruby %}
def install
  system "make"
  mkdir_p pkgshare #tests and examples should be installed to pkgshare
  cp_r "test", pkgshare
  cp_r "examples", pkgshare
  system "make", "install", "PREFIX=#{prefix}"
end
{% endhighlight %}
the `prefix` variable will be set to the same thing as
`$HOMEBREW_FORMULA_PREFIX`.

Next, set up the tests. 
To test the install we'll compile one of the examples and make sure that it's
output is correct. I chose `examples/ex_osc.c` because it is very simple.
{% highlight ruby %}
test do
  system ENV.cc, "#{pkgshare}/examples/ex_osc.c", "-o#{testpath}/test",
        "-L#{lib}", "-L#{HOMEBREW_PREFIX}/lib", "-lsndfile", "-lsoundpipe"
  system "cd #{testpath};./test"
  hash = "07caba5db440b7442fbe8d40145e0dbc06ef52c0088380e581c6071a05c94bc6"
  #make sure to `require "digest"` at the top of the file
  assert_equal hash, Digest::SHA256.file("#{testpath}/test.wav").hexdigest
end
{% endhighlight %}

Finally run 
{% highlight shell %}
brew reinstall soundpipe
brew test soundpipe
brew audit --strict soundpipe
brew audit --new-formula --online soundpipe
{% endhighlight %}
Assuming everything went alright you are good to issue a pull request and try to
get your new formula added. If either of the audit commands issued suggestions,
fix them before you move on. 

To issue a pull request, first make sure you have forked
[https://github.com/Homebrew/homebrew-core/pull/28089](https://github.com/Homebrew/homebrew-core/pull/28089).
The run `cd $(brew --repo homebrew/core)` to go to the git repo with all the formulas.
From here run 
{% highlight shell %}
git checkout -b soundpipe 
git add Formula/soundpipe.rb
git commit
{% endhighlight %}

Follow these rules for formatting your commit message:
```
The established standard for Git commit messages is:

the first line is a commit summary of 50 characters or less
two (2) newlines, then
explain the commit thoroughly
At Homebrew, we like to put the name of the formula up front like so: foobar 7.3
(new formula). This may seem crazy short, but you’ll find that forcing yourself
to summarise the commit encourages you to be atomic and concise. If you can’t
summarise it in 50-80 characters, you’re probably trying to commit two commits
as one.
```

Now run 
```shell
git push https://github.com/username/homebrew-core/ soundpipe
```
and open a pull request!

[Here's](https://github.com/gabcoh/homebrew-core/blob/a874848f62e6f59e97e6427a6ba2ce9de2f4ddc5/Formula/soundpipe.rb)
a link to the complete formula.

That should be it. After this, all you need to do is wait for your pull request
to be merged and watch for any comments or suggestions on the thread!

The entire workflow comes down to creating the template formula, installing and
testing the package manually then converting that into ruby. You don't have to
write any boiler plate whatsoever!
Tooling like this is so important to maintaining a healthy ecosystem around a
project, especially something as ambitious as a package manager. 
