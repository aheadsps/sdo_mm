from rest_framework import viewsets, mixins


class GetUpdateDeleteViewSet(mixins.UpdateModelMixin,
                             mixins.DestroyModelMixin,
                             mixins.RetrieveModelMixin,
                             mixins.CreateModelMixin,
                             viewsets.GenericViewSet,
                             ):
    """
    Виюв сет на Создание, обновление, удаление и получение
    объекта по {ID}
    """

    ...
