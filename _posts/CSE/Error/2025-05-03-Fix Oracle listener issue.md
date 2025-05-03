---
title: "Fix Oracle listener issue"
categories:
  - error
tags:
  - Error
  - Database
  - SQLDeveloper
  - Oracle
  - Docker
toc: true
toc_sticky: true

date: 2025-05-03
last_modified_at: 2025-05-03
comments: true
---

## 문제 상황
- MacOS에서 SQL Developer를 사용해 Oracle Database에 접속하려고 했으나, 오류가 생겨 접속이 안됨. DB 접속 테스트를 시도하면 에러 팝업이 뜨고 연결에 실패함.
<img src="/assets/posts/CSE/Error/250503/20250503-1.png" alt="Oracle Listener Error" width="600">
<br><br/>
  

<br><br>
## 문제 원인
```yaml
ORA-12541: Cannot connect. No listener at host localhost port 1521.
```

- Oracle DB의 listener가 동작하지 않음. 노트북 재부팅하면서 안된거 보면 Docker 컨테이너가 꺼진 것 같다. 이때 listener도 같이 꺼진 듯.
- MacOS에서 SQL Developer로 Oracle DB를 사용하려면 Docker가 필요함.

<br><br>
## 해결 방법
1. Colima 시작
```bash
colima start --arch x86_64 --memory 4 --cpu 2
```
- Oracle 이미지는 대부분 x86_64 기반으로 빌드되어 있음. 내 노트북 칩은 ARM 아키텍처를 사용해서, Colima로 x86_64 VM을 실행해야함.

2. Oracle XE Docker 이미지 설치
```bash
docker run -d \
  --name <DB 이름> \
  -p 1521:1521 \
  -e ORACLE_PASSWORD=<비밀번호> \
  gvenzl/oracle-xe
```

2. 컨테이너에서 출력되는 로그 조회 
```bash
docker logs -f oracle-db
```
  <img src="/assets/posts/CSE/Error/250503/20250503-log.png" alt="Connected" width="300">


<br>

  ```shell
#########################
DATABASE IS READY TO USE!
#########################
  ```

  이 문구를 확인하면 이제 컨테이너 내부에서 데이터베이스가 완전히 기동되었고, SQL Developer 등 외부 클라이언트에서 접속 후 사용이 가능하다는 것을 알 수 있다.
<br><br>

## 성공~
- 다시 사용할 수 있게 되었다.
<img src="/assets/posts/CSE/Error/250503/20250503-2.png" alt="Connected" width="600">

<br><br>

## 기타
### 📍 Docker 컨테이너 삭제하는 법
1. 실행 중 컨테이너 중지
```bash
docker stop <컨테이너 이름 또는 ID>
```

2. 중지한 컨테이너 삭제
```bash
docker rm <컨테이너 이름 또는 ID>
```
3. 중지된 모든 컨테이너 한 번에 삭제
```bash
docker container prune
```

4. 실행중인 컨테이너 전부 강제 삭제
```bash
docker rm -f $(docker ps -aq)
```
<br><br>


### 📍 컨테이너 재생성 및 실행을 했는데도 안된다면

- 건드린 적 없는 비밀번호가 틀렸다며 접속이 안된다고 함...

1. 컨테이너 내부 진입
```bash
docker exec -it oracle-db bash
sqlplus / as sysdba
```

2. 사용자 생성 시도
```bash
ALTER USER <사용자이름> IDENTIFIED BY <비밀번호>;
```

3. ORA-01918 실패 시 사용자 생성
```bash
ALTER SESSION SET "_ORACLE_SCRIPT" = TRUE;
CREATE USER <사용자이름> IDENTIFIED BY <비밀번호>;
GRANT CONNECT, RESOURCE TO <사용자이름>;
ALTER USER <사용자이름> DEFAULT TABLESPACE users QUOTA UNLIMITED ON users;
```

  → 이렇게 했더니 접속에 성공했다.
<br><br>