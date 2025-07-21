VER=v0.039b
docker build ./nginx-rp --tag mohamedshahidh/nimesh-rp:$VER && docker push  mohamedshahidh/nimesh-rp:$VER
echo mohamedshahidh/nimesh-rp:$VER