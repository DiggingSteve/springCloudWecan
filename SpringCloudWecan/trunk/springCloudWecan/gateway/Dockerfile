
FROM frolvlad/alpine-glibc:latest
ENV JAVA_HOME /jdk
ENV CLASSPATH $JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar
ENV PATH $PATH:$JAVA_HOME/bin:$JAVA_HOME/sbin
VOLUME /tmp
EXPOSE 9000
ENTRYPOINT ["java","-Xms64m","-Xmx256m","-jar","/target/gateway-0.0.1.jar"]