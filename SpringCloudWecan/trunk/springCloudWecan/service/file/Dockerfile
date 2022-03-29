
FROM frolvlad/alpine-glibc:latest
ENV JAVA_HOME /jdk
ENV CLASSPATH $JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar
ENV PATH $PATH:$JAVA_HOME/bin:$JAVA_HOME/sbin
VOLUME /data
WORKDIR /home/file
EXPOSE 8150
ENTRYPOINT ["java","-Xms1024M","-Xmx1024M","-Xmn256M","-Xss256K","-jar","/target/file-0.0.1.jar"]