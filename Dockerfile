FROM wordpress:php7.2

RUN rm -rf /usr/src/wordpress/wp-content/themes
RUN rm -rf /usr/src/wordpress/wp-content/plugins/*