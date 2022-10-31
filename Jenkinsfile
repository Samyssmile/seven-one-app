pipeline {
    agent any
    stages {
        stage('Install Stage') {
          when {
            branch "main"
          }
          tools {nodejs "nodejs"}
          steps {
              echo 'Npm Install...'
              sh 'node -v'
              sh 'npm -v'
              sh 'npm install'
          }
        }

        stage('Lint Stage') {
          when {
            branch "main"
          }
            tools {nodejs "nodejs"}
          steps {
            sh 'npm run lint'
          }
        }

/*         stage('Test Stage') {
          when {
            branch "main"
          }
            tools {nodejs "nodejs"}
          steps {
            sh 'npm run test-headless'
          }
        } */

        stage('Build Production Stage') {
          when {
            branch "main"
          }
          tools {nodejs "nodejs"}
           steps {
            sh 'npm run build-prod'
           }
        }

        stage('Building Docker Image') {
          when {
            branch "main"
          }
            steps {
                echo 'start build staging image and publish it...'
                withCredentials([usernamePassword(credentialsId: 'AkogareDockerRegistry', passwordVariable: 'password', usernameVariable: 'username')]) {
                    sh "docker login https://registry.akogare.de -u $username -p $password"
                    sh 'docker build -t registry.akogare.de/seven-one:1.0.0-RELEASE -t registry.akogare.de/seven-one:latest .'
                    sh 'docker push registry.akogare.de/seven-one:1.0.0-RELEASE'
                    sh 'docker push registry.akogare.de/seven-one:latest'
                }
            }
        }
    }
/*      post {
        always {
            echo 'Make Portainer Webhook'
            sh 'curl -X POST https://portainer.akogare.de/api/webhooks/c83d20c3-dd14-41af-b4ad-330b64191e2f'
        }
    } */
}
