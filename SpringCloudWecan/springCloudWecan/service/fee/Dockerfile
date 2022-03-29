
FROM upananda2017/amazon-corretto-8
VOLUME /tmp
COPY  target/fee-0.0.1.jar fee.jar
RUN bash -c "touch /fee.jar"
EXPOSE 8180
ENTRYPOINT ["java","-jar","fee.jar"]