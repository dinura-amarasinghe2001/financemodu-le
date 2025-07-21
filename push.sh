VER=v0.042b
ng build
docker build ./nginx-nimesh --tag mohamedshahidh/nimesh-dashboard:$VER && docker push  mohamedshahidh/nimesh-dashboard:$VER
echo mohamedshahidh/nimesh-dashboard:$VER
