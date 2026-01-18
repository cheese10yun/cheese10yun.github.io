(function($) {
    'use strict';

    /**
     * Table of Contents generator
     */
    var TableOfContents = {
        /**
         * Initialize table of contents
         */
        init: function() {
            var self = this;
            var $post = $('.post-content');
            var $tocContainer = $('#toc-container');

            if ($post.length === 0 || $tocContainer.length === 0) {
                return;
            }

            // Find all headings (h1, h2, h3, h4)
            var headings = $post.find('h1, h2, h3, h4').filter(function() {
                // Exclude table-of-contents heading if exists
                return $(this).attr('id') !== 'table-of-contents';
            });

            if (headings.length === 0) {
                $tocContainer.hide();
                return;
            }

            // Generate TOC
            var tocHtml = self.generateTOC(headings);
            $('#toc-list').html(tocHtml);

            // Add smooth scroll
            self.addSmoothScroll();

            // Track active section
            self.trackActiveSection(headings);

            // Handle window resize
            $(window).on('resize', function() {
                self.handleResize();
            });

            self.handleResize();
        },

        /**
         * Generate TOC HTML
         */
        generateTOC: function(headings) {
            var tocItems = [];
            var minLevel = 6;

            // Find minimum heading level
            headings.each(function() {
                var level = parseInt(this.tagName.substring(1));
                if (level < minLevel) {
                    minLevel = level;
                }
            });

            // Generate TOC items
            headings.each(function(index) {
                var $heading = $(this);
                var level = parseInt(this.tagName.substring(1));
                var text = $heading.text();
                var id = $heading.attr('id');

                // Generate ID if not exists
                if (!id) {
                    id = 'heading-' + index;
                    $heading.attr('id', id);
                }

                // Calculate indent level
                var indentLevel = level - minLevel;

                tocItems.push(
                    '<li class="toc-item toc-level-' + indentLevel + '" data-level="' + level + '">' +
                    '<a href="#' + id + '" class="toc-link">' + text + '</a>' +
                    '</li>'
                );
            });

            return tocItems.join('');
        },

        /**
         * Add smooth scroll behavior
         */
        addSmoothScroll: function() {
            $('#toc-list a').on('click', function(e) {
                e.preventDefault();
                var target = $(this).attr('href');
                var $target = $(target);

                if ($target.length) {
                    var offsetTop = $target.offset().top - 80; // 80px offset for header

                    $('html, body').animate({
                        scrollTop: offsetTop
                    }, 300);
                }
            });
        },

        /**
         * Track active section on scroll
         */
        trackActiveSection: function(headings) {
            var self = this;
            var observer = new IntersectionObserver(
                function(entries) {
                    entries.forEach(function(entry) {
                        if (entry.isIntersecting) {
                            var id = entry.target.id;
                            self.setActiveLink(id);
                        }
                    });
                },
                {
                    rootMargin: '-100px 0px -66% 0px',
                    threshold: 0
                }
            );

            headings.each(function() {
                observer.observe(this);
            });
        },

        /**
         * Set active TOC link
         */
        setActiveLink: function(id) {
            $('#toc-list a').removeClass('active');
            $('#toc-list a[href="#' + id + '"]').addClass('active');
        },

        /**
         * Handle window resize
         */
        handleResize: function() {
            var $tocContainer = $('#toc-container');
            var windowWidth = $(window).width();

            // Hide TOC on mobile devices (width < 1024px)
            if (windowWidth < 1024) {
                $tocContainer.hide();
            } else {
                $tocContainer.show();
            }
        }
    };

    // Initialize on document ready
    $(document).ready(function() {
        TableOfContents.init();
    });

})(jQuery);
